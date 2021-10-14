const express = require('express');
const db = require('../db/queries');

const router = express.Router();



router.post('/add',async(req,res)=>{
     let u_ = req.body.value;
     
     await db.add(req.session.myid,req.body.value).then((result)=>{
         if(result==1){
             res.status(200).send((1).toString());
         }else{
             res.status(200).send((0).toString());
         }
     })


})

module.exports=router;