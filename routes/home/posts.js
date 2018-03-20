var express = require("express")
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/myblog"
let ObjectId=require("mongodb").ObjectId;
var router=express.Router()
//实现二级路由
router.get('/',(req,res,next)=>{
    var id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        var c=db.collection("posts")
        c.find({_id:ObjectId(id)}).toArray(function (err,docs) {
            if(err){
                res.send(err)
                return;
            }
            var col=db.collection("cats");
            col.find().toArray((err,result)=>{
                if(err){
                    res.send(err)
                    return;
                }
                res.render('home/article',{data:docs[0],data1:result})
            })
        })
    })
})

module.exports=router;