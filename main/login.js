const { render } = require('ejs');
const express = require('express');
const db = require('../db/queries');
const path = require('path');
const { EWOULDBLOCK } = require('constants');


const router = express.Router();
router.get("/",(req,res)=>{
    if(req.session.userid){
        res.redirect("/dashboard")
    }else{

    
    res.render('login.ejs');
}
})
function check(req,res,next){
   
    if(!req.session.userid){
        res.redirect("/");
    }else{
        next();
    }

}
router.use('/images',function(req,res,next){
    if(!req.session.userid){
        res.redirect("/");
    }else{   
        next();
    }
});
router.use('/images',express.static(`users/aakashthepro`));


router.post('/create',async(req,res)=>{
   let result = await db.create(req.body.email,req.body.password,req.body.name)
       if(result!=0){
           req.session.userid=req.body.email;
           req.session.myid=result[0].userid
           req.session.name=result[0].name
           db.addkey(req.session.userid);
           res.redirect("/dashboard");
       }else{
           res.send("Account with email already exist")
       }
   })
router.post('/login',async(req,res,next)=>{

  let result= await db.check(req.body.email,req.body.password)
       if(result!=0){
           req.session.myid=result.userid;
           req.session.name=result.name;
           
           next()
       }else{
           res.send("ERROR WRONG COMBINATION");
       }
   })
router.post('/login',async(req,res)=>{
    req.session.userid=req.body.email;

    res.redirect("/dashboard");



   
})

router.get('/dashboard',check,async(req,res)=>{

    req.session.key= await db.getkey(req.session.myid);

    res.render("space.ejs",{name:req.session.name});

})

router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/");
    
})
module.exports=router;