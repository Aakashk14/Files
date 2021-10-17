const express = require('express');
const db = require('../db/queries');
const con = require('../db/config');



function userslist(myid){
    return new Promise(data=>{

    con.query("select Name,email from users where userid in(select friendid from relations where userid=?)",[myid],(err,rows)=>{
        if(rows.length!=0){
            data(rows)
        }else{
            data(0)
        }
    })})}

const router = express.Router()

router.get('/panel',async(req,res)=>{


    let data = await userslist(req.session.myid)
    if(data!=0){
        res.render('panel.ejs',{users:data,name:req.session.name})
    }else{
        res.render('panel.ejs',{name:req.session.name});
    }
})

 

module.exports=router;