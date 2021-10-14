const mongoose = require('mongoose');
const account = require('../mongodb/users')
const relationship =  new mongoose.Schema({
    userid:Number,
    friendid:Number,


})

const relations = mongoose.model("relations",relationship,"relations");





module.exports=relations;