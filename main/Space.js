const express = require('express');
const path = require('path');
const router = express.Router();
const db = require('../db/queries');

router.get("/shared",async(req,res)=>{
let result = await db.shared(req.session.myid)
    if(result!=0){
        res.render("shared.ejs",{users:result,name:req.session.name});
    }else{
        res.render("shared.ejs",{name:req.session.name});
    }
});


router.get("/users/:name",async(req,res,next)=>{
   let result= await db.access(req.session.myid,req.params.name)
        if(result==0){
            res.send("You Do not have access to this user space");
        }else{
            next();
        }
    })

router.get("/users/:name",async(req,res)=>{
    
     let result = await db.files(req.params.name)
        if(result.length!=0){
            
        
            res.render("sharedfiles.ejs",{files:result,name:req.session.name});
        }else{
    res.render("sharedfiles.ejs",{name:req.session.name});
}
    })



router.get("/myfiles",async(req,res)=>{


    let result= await db.files(req.session.userid)
        if(result!=0){
            res.render("files.ejs",{files:result,name:req.session.name});
        }else{
            res.render("files.ejs",{name:req.session.name});
        }
    })



router.use('/images/:key',async function(req,res,next){
        if(!req.session.userid){
            res.redirect("/");
        }else if(req.params.key==req.session.key){
            next();
        }else if(await db.access_sp(req.session.myid,req.params.key)==1){
              next()
        }else{
              res.send("404")
          }
        })


router.use('/images/:key/:name',function(req,res){
        res.sendFile(path.join(__dirname,`../users/${req.params.key}/${req.params.name}`));
    
    
    })
module.exports=router;