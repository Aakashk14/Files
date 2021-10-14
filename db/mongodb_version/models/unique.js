const mongoose = require('mongoose');
const account = require('../mongodb/users')



const unique = new mongoose.Schema({
    identity:String,
    email:String
})


const key = mongoose.model("key",unique,"key");

   



module.exports=key;