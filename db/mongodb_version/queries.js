const express = require('express');
const account = require('../db/mongodb/users');
const files = require('../db/mongodb/files');
const relations = require('../db/mongodb/relations');
const getkey = require('../db/mongodb/unique')
 const generaterand = async()=>{
    var string = "abcdefghijklmnopqrstuvwxyz1234567890"
    var str="";
                  
          for(let i=0;i<10;i++){
             var rand = (Math.random()*36).toString().split(".");
             str = str + string[rand[0]];
    }
    let value;
     await getkey.find({identity:str}).then(function(result){ value = result;});
    if(value.length==0){
    return str;
    }else{
       generaterand()
    }
    }


    
function seq(){
return new Promise((resolve,reject)=>{
account.find({}).sort({userid:-1}).then((res)=>{
    if(res.length >0){
    resolve(res[0].userid+1)
    } else{
        resolve(1);
    }
})
})}

 function check(myemail,mypass){
    
        return new Promise((resolve,reject)=>{
        account.find({
            email:myemail,
            password:mypass
        }).then((result)=>{
            if(result.length >0){
                resolve(result[0].userid);
            }else
        {
            resolve(0)
        }
        })})}

async function create(email,password,name){
            return new Promise(data=>{
                        return seq().then((val)=>{
                        let tn = new account({
                            email:email,
                            password:password,
                            name:name,
                            userid:val
                        })
                        tn.save((err,doc)=>{
                            if(err){
                                data(0)
                            }else{
                                account.find({
                                    email:email
                                },'userid').then((result)=>{
                                    data(result)
                                }
                                )
                            }
                        })})
                    })
                }
                

async function addkey(email){
    return new Promise(async(data)=>{
    await generaterand().then((str)=>{
        
    let tm = new getkey({
        identity:str,
        email:email

    })
    tm.save((err,doc)=>{
        if(err) console.log(err)
    })
    data(str)
})})
}
 function getfiles(email){
                return new Promise((resolve,reject)=>{
                    files.find({
                        email:email
                    },'filename filetype').then((result)=>{
                        if(result.length>0){
                            resolve(result)
                        }else{
                            resolve(0)
                        }
                    })
                
            })
            }            
     
function storefile(filename,email,filetype)
{
    let t = new files({
        email:email,
        filename:filename,
        filetype:filetype
    })
    t.save((err,doc)=>{
        if(err) console.log(err)
    })
   
     
       
}

function getsharedspace(id){
    return new Promise((resolve,reject)=>{
relations.aggregate([{"$match":{"userid":id}},{"$lookup":{
    "from":"account",
    "localField":"friendid",
    "foreignField":"userid",
    "as":"email"


}},{"$project":{
    email:"$email.email",
    name:"$email.name"
}}]).then((result)=>{
    if(result.length > 0){

    resolve(result)
    }else{
        resolve(0)
    }
})
    })}
function access(id,email){
    return new Promise((resolve,reject)=>{
        account.aggregate([{"$match":{"email":email}},{"$lookup":{
            "from":"relations",
            "localField":"userid",
            "foreignField":"userid",
            "as":"userid"
        
        
        }},{"$project":{
            userid:"$userid.friendid"
        }},{"$match":{"userid":id}}
        ]).then((res)=>{
            if(res.length >0){
                resolve(1)
            }else{
                resolve(0)
            }
        })
    })}

function getspace(id){
return new Promise((resolve,reject)=>{
    relations.aggregate([{
        "$match":{"friendid":id}
    },{"$lookup":{
        "from":"account",
         "localField":"userid",
         "foreignField":"userid",
         "as":"emails"
    }},{"$project":{
        email:"$emails.email"
    }}]).then((res)=>{
        if(res.length >0){
            resolve(res)
        }else{
            resolve(0)
        }
    })
})}



function add(myid,friendemail){
    return new Promise((resolve,reject)=>{
        account.find({
            email:friendemail
        },'userid').then((result)=>{
            if(result.length > 0){
                let tm = new relations({
                    userid:myid,
                    friendid:result[0].userid
                })
                tm.save((err,doc)=>{
                    if(err) console.log(err)
                })
                resolve(1)
            }else{
                resolve(0)
            }

        })})
    }
  
function findkey(email){
    return new Promise((resolve,reject)=>{

    
    getkey.find({
        email:email
    },'identity').then((result)=>{
        console.log(result,"result identity")
        resolve(result[0].identity)
    })
})}
           
function access_sp(identity,id){
    return new Promise((resolve,reject)=>{

        getkey.aggregate([{
            "$match":{"identity":identity}
        },{"$lookup":{
            "from":"account",
            "localField":"email",
            "foreignField":"email",
            "as":"users"
        }},{"$lookup":{
            "from":"relations",
            "localField":"users.userid",
            "foreignField":"userid",
            "as":"users"
        }},{"$unwind":"$users"},
        {"$match":{"users.friendid":id}}
        ]).then((res)=>{
            console.log(res)
            if(res.length >0){
                resolve(1)
            }else{
                resolve(0)
            }
        
        })
    })}

        module.exports={
            check:check,
            create:create,
            files:getfiles,
            store:storefile,
            shared:getsharedspace,
            access:access,
            add:add,
            findkey:findkey,
            addkey:addkey,
            access_sp:access_sp,
            getspace:getspace

        }
