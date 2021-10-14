const express = require('express');
const mysql = require('mysql');

const con = mysql.createConnection({
    host:'localhost',
    user:'root007',
    password:'',
    database:'files'
})
 con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
  });


module.exports=con;

