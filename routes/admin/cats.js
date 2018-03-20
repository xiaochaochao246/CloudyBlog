let express=require("express")
let MongoClient = require("mongodb").MongoClient
const DB_STR= "mongodb://localhost:27017/myblog"
let ObjectId=require("mongodb").ObjectId;

var router=express.Router()
//显示分类
router.get('/',(req,res,next)=>{
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        var c=db.collection("cats")
        c.find().toArray((err,docs)=>{
            if(err){
                res.send(err);
                return;
            }
                //数据和视图一起渲染
                res.render('admin/category_list',{data:docs});
        });
    })
});

router.get('/add',(req,res,next)=>{
    res.render('admin/category_add')
});

router.post('/add',(req,res,next)=>{
    var title=req.body.title;
    var sort=req.body.sort;
    var num=req.body.num;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return
        }
        var col =db.collection("cats")

        col.insert({title:title,sort:sort,num:num},(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.send("添加分类成功了<a href='/admin/cats'>查看分类</a>")
            }
        })
    })
})

router.get('/edit',(req,res,next)=>{
    var id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        var c=db.collection("cats")
        // console.log(ObjectId(id))
        c.find({_id:ObjectId(id)}).toArray((err,docs)=>{
            if(err){
                res.send(err)
                return
            }
            db.close();
            res.render('admin/category_edit',{data:docs[0],id: id})
        })
    })
})
router.post('/edit',(req,res,next)=>{
    let title=req.body.title;
    let sort=req.body.sort;
    let num=req.body.num;
    let id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        var c=db.collection("cats")
        c.updateOne({_id:ObjectId(id)},{title,sort,num},(err,result)=>{
            if(err){
                res.send(err)
            }else {
                res.send("更新成功了<a href='/admin/cats'>返回分类列表</a>")
            }
        })
    })
})
router.get('/delete',(req,res,next)=>{
    var id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        var c=db.collection("cats")
        c.remove({_id:ObjectId(id)},(err,result)=>{
            if(err){
                res.send(err);
                return;
            }
            res.redirect('/admin/cats')
        })
    })
});
module.exports=router;