var express = require('express');
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/chendachao"
let ObjectId=require("mongodb").ObjectId;
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin/register');
});

router.post('/register',(req,res,next)=>{
    var users=req.body.username;
    var pwd=req.body.pwd;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return
        }
        var col =db.collection("users");
        col.find({username:users},{_id:0}).toArray((err,obj) =>{
            if(err){
                res.send(err);
            }else{
                console.log(obj)
                if(obj.length==0){
                    col.insert({username:users,pwd:pwd},(err,docs)=>{
                        if(err){
                            res.send(err)
                            return;
                        }
                        res.send("注册成功了<a href='/admin/users'>请登录</a>")
                    })
                }else{
                    res.send("用户名已存在<a href='/register'>请重新注册</a>")
                }
            }
        })

    })
})


module.exports = router;