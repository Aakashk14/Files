const express = require('express');
const store = require('../db/queries');
const router = express.Router();
const fs = require('fs')
const multer = require('multer');


// I havent added group permission check for file uploads [IDOR vuln's there]

const storage= multer.diskStorage(
    {destination:function(req,file,cb){
            let dr= "users/"+req.session.key;
    
            if(fs.access(dr,(err)=>{

            }))
            {
            cb(null,dr)
            }else{
                fs.mkdirSync(dr,{recursive:true},function(err){
                    if(err) console.log(err)
                })
                cb(null,dr)
            }
        },
filename: function(req,file,cb){
    //let a = file.originalname.slice(-4);
    //let b = file.originalname.split(".");
     a=file.originalname.split(".")[0]+"_"+Date.now()+"."+file.originalname.split(".")[1];

     store.store(a,req.session.userid,a.split(".")[1]);

    cb(null,a)}


})

const upload=multer({storage:storage});


router.post("/upload",upload.single("file"),(req,res)=>{

    res.redirect("/myfiles");
    


})


module.exports=router;