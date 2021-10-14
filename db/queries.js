const con = require('./config');


async function getstring(str){
    return new Promise(data=>
    con.query("Select identity from userkey where identity=?",[str],(err,rows)=>{
        data(rows);
    }))}

const generaterand = async()=>{
    var string = "abcdefghijklmnopqrstuvwxyz1234567890"
    var str="";
                  
          for(let i=0;i<10;i++){
             var rand = (Math.random()*36).toString().split(".");
             str = str + string[rand[0]];
    }
     
     let value = await getstring(str)

    
    if(value.length==0){

    return str;
    }else{
       generaterand()
    }
}

function add(myid,friendemail){
    return new Promise(resolve=>{
    con.query("Select userid from users where email=?",[friendemail],(err,rows)=>{
        if(rows.length >0){
            con.query("Insert into relations(userid,friendid) values(?,?)",[myid,rows[0].userid]);
            resolve(1);

        }else{
           resolve(0);
        }
    })
})}





function check(myemail,mypass){
    return new Promise((resolve,reject)=>{
        con.query("Select * from users where email=? and password=?",[myemail,mypass],(err,rows)=>{
            if(rows.length > 0){
                resolve(rows[0].userid);
            }else{
                resolve(0);
            }
        })
    })
}

function storefile(filename,email,filetype)
{
   
        con.query("Insert into private(email,filename,filetype) values(?,?,?)",[email,filename,filetype],(err)=>{
            if(err) console.log(err)
           
        }
        )
       
}

function getfiles(email){
    return new Promise((resolve,reject)=>{
    con.query("select private.filename,private.filetype,users.userid,userkey.identity from private inner join users on private.email=users.email inner join userkey on users.userid=userkey.userid where users.email=?",[email],(err,rows)=>{
        if(err) {console.log(err)};
        if(rows.length > 0){
            resolve(rows)
        }else {
            resolve(0)
        }
    })
})
}

function static(email){
    return new Promise((resolve,reject)=>{
        con.query("Select hash from active where email=?",[email],(err,rows)=>{
            resolve(rows);
        })
    })
}

function getsharedspace(id){
    return new Promise((resolve,reject)=>{
        con.query("select email from users where userid in(select userid from relations where friendid=?)",[id],(err,rows)=>{
            if(rows.length > 0){
                resolve(rows);
            }else{
                resolve(0);
            }
        })

    })
}

function access(userid,email){
    return new Promise((resolve,reject)=>{

    
    con.query("select * from relations where friendid=? and userid=(select userid from users where email=?)",[userid,email],(err,rows)=>{
        if(rows.length >0){
            resolve(1);
        }else{
            resolve(0);
        }
    })})}

    function create(email,password,name){
        return new Promise(resolve=>{
                    con.query("Insert into users(email,password,name) values(?,?,?)",[email,password,name],(err,rows)=>{
                        if(err){
                            resolve(0)
                        }else{
                        con.query("Select userid from users where email=?",[email],(err,rows)=>{
                            resolve(rows)
                        })

                    }
                })})}

async function addkey(email){

  
   await generaterand().then((result)=>{

    con.query("Insert into userkey(userid,identity) values((select userid from users where email=?),?)",[email,result])
    })
}

async function getkey(id){
    return new Promise(data=>{

    con.query("Select identity from userkey where userid=?",[id],(err,rows)=>{
        data(rows[0].identity)
    })
})}

function access_sp(friendid,identity){
    return new Promise(data=>{

        con.query("select userid from relations where friendid=? and userid= (select userid from userkey where identity=?)",[friendid,identity],(err,rows)=>{
            if(rows.length>0){
                data(1)
            }else{
                data(0)
            }
        })})}
module.exports={
    add:add,
    check:check,
    store:storefile,
    files:getfiles,
    static:static,
    shared:getsharedspace,
    access:access,
    create:create,
    addkey:addkey,
    getkey:getkey,
    access_sp,access_sp
}