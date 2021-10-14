const mongoose = require('mongoose');

const users =  new mongoose.Schema({
    email:{type:String,unique:true,required:true},
    password:String,
    name:String,
    userid:Number


})

const account = mongoose.model("account",users,"account");




module.exports=account;