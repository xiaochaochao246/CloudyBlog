let express=require("express");
let MongoClient = require("mongodb").MongoClient;
const DB_STR= "mongodb://localhost:27017/chendachao";
let ObjectId=require("mongodb").ObjectId;
var router=express.Router();
//显示文章
router.get('/',(req,res,next)=>{
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        var c=db.collection("posts");
        c.find().toArray((err,docs)=>{
            if(err){
                res.send(err);
                return;
            }
            //数据和视图一起渲染
            res.render('admin/article_list',{data:docs});
        });
    })
})
//添加文章列表
router.get('/add',(req,res)=>{
    MongoClient.connect(DB_STR,(err,db)=> {
        if (err) {
            res.send(err);
            return;
        }
        var c = db.collection("cats");
        c.find().toArray((err, docs) => {
            if (err) {
                res.send(err);
                return;
            }
            res.render('admin/article_add', {data:docs})
        })
    })
})
//修改文章
router.get('/edit',(req,res,next)=>{
    var id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        var c=db.collection("posts");
        c.find({_id:ObjectId(id)}).toArray((err,docs)=>{
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
                res.render('admin/article_edit',{data:docs[0],data1:result,id:id})
            })

        })
    })
})
//编辑文章
router.post('/edit',(req,res,next)=>{

    var id=req.query.id;
    let cat=req.body.cat;
    let title=req.body.title;
    let summary=req.body.summary;
    let content=req.body.content;
    let time=new Date();
    let post={
        cat,
        title,
        summary,
        content,
        time
    }
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return;
        }
        var c=db.collection("posts")
        c.updateOne({_id:ObjectId(id)},post,(err,result)=>{
            if(err){
                res.send(err)
                return;
            }
                res.send("更新成功了<a href='/admin/posts'>返回文章列表</a>")

        })
    })
})
//完成具体添加文章功能
router.post('/add',(req,res)=>{
    //获取表单提交的数据
    let cat=req.body.cat;
    let title=req.body.title;
    let summary=req.body.summary;
    let content=req.body.content;
    let time=new Date();
    let post={
        cat,
        title,
        summary,
        content,
        time
    }
    // console.log(post);
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err)
            return
        }
        var col =db.collection("posts");

        col.insert(post,(err,result)=>{
            if(err){
                res.send(err);
                return;
            }
                res.send("添加文章成功了<a href='/admin/posts'>查看文章</a>")
        })
    })
});
//删除文章
router.get('/delete',(req,res,next)=>{
    var id=req.query.id;
    MongoClient.connect(DB_STR,(err,db)=>{
        if(err){
            res.send(err);
            return;
        }
        var c=db.collection("posts")
        c.remove({_id:ObjectId(id)},(err,result)=>{
            if(err){
                res.send(err);
                return;
            }
            res.redirect('/admin/posts')
        })
    })
});
module.exports=router;