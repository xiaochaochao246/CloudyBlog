var express = require('express');
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/myblog"
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  MongoClient.connect(DB_STR,(err,db)=>{
    if(err){
      res.send(err)
        return
    }
    var c=db.collection("posts")
      c.find().toArray((err,docs)=>{
        if(err){
          res.send(err)
            return
        }
        var col=db.collection("cats");
        col.find().toArray((err,result)=>{
          if(err){
            res.send(err)
              return;
          }
          res.render('home/index',{data:docs,data1:result})
        })
      })
  })
});

module.exports = router;
