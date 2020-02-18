(()=>{
    'use strict'
    
    const express = require("express");
    let app = express();
    const admin = require("firebase-admin");
    var admin_app = admin.initializeApp();
    app.use(express.static('public'));
    var router = require("express").Router();
    const bodyParser = require("body-parser");
    /*HTMLフォームからpostを受け取るためには必要らしい*/ 
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    var session = require("express-session");

    // -----------Firebase初期化------------------------//
    //参考文献　https://qiita.com/yoko8ma/items/c3d117d1ecb1ac34011c
    var HttpStatus = require('http-status-codes');
    var firebase = require("firebase")
    const config = {    
        apiKey: "AIzaSyACq5saiq5kGF8y8w5m6S51Z9nEGJRdwhY",
        projectId: "rikougakki"
    };

    firebase.initializeApp(config);
    admin.initializeApp(config);
    
    app.post('/upload', (req, res) => {
        var email = req.body.email
        var password = req.body.pass
        // 認証処理
        firebase.auth().signInWithEmailAndPassword(email, password) 
        .then(function(result) {
            console.log('OK');
            res.send('Auth OK');
          }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + " : " + errorMessage);
          });
    });

    

    let server = app.listen(5000,function(){
        console.log("Server Start at port 5000!");
    });
    
    
    app.get('/index.html',function(req,res){
        console.log("index.html");
        res.sendFile(__dirname + '/index.html');
    });
    app.get('/connect.html',function(req,res){
        console.log("connect.html");
        res.sendFile(__dirname + '/connect.html');
    });
    
    app.use(session({
        secret:'secret',//この文字列によってcokkieIDが暗号化されて書き換えが行われているかを判断する
        resave:false,//セッションにアクセスすると上書きされるオプション
        saveUninitialized:false,//未初期化状態のsessionも保存するかどうか？
        cookie:{
            httpOnly:true,//クライアント側でcokkieの閲覧、書き換えが行えないようにするオプション
            secure:false,//httpsで使用する場合は必ずtrueにする
            maxage:1000 * 60//セッションの稼働時間。ミリ秒なのでこれは１分
        }
    }))
})()