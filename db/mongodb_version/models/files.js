const mongoose = require('mongoose');

const file =  new mongoose.Schema({
    email:String,
    filename:String,
    filetype:String


})

const files = mongoose.model("files",file,"files");



module.exports=files;