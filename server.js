const express = require('express');
const panel = require('./main/panel');
const mysql = require('mysql');
const session = require('express-session');
const basicAuth = require('express-basic-auth');

var x_session = session({
    secret:"abcd145",
    resave:false,
    saveUninitialized:false,
})

// No csrf Protection as its a dev demo , add one if you use this

const app = express();

app.set("view engine","ejs");
app.use(express.static('public'))

app.use(x_session);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./main/login.js'));
app.use(require('./main/panel'));
app.use(require('./main/upload'));
app.use(require('./main/adduser'));
app.use(require('./main/Space'));




app.get("/signup",(req,res)=>{
    res.render("signup.ejs")
})
app.use("/default",express.static("public/default"));
const host = "0.0.0.0";
app.listen(3000,host);