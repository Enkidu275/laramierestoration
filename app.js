const http=require('http');
const https=require('https');
const express=require('express');
//const cookie=require('cookie-parser');
const path=require('path');
const fs=require('fs');
const jwt=require('jsonwebtoken');
const mysql=require('mysql2');
const uuid=require('uuid');
const credentials={
    cert:fs.readFileSync(path.join(__dirname,'ssl/cert.crt')),
    key:fs.readFileSync(path.join(__dirname,'ssl/cert.key'))
};
//app.use(cookie);
require('dotenv').config();
const port=process.env.PORT || 3100;
const sslport=process.env.SSLPORT || 3150;
const username=process.env.USERNAME || '';
const password=process.env.PASSWORD || '';
const agentcode=process.env.AGENTCODE || 'agentcode';
var db=mysql.createConnection({
    host:process.env.MYSQLHOST||'localhost',
    user:process.env.MYSQLUSER||'root',
    password:process.env.MYSQLPASSWORD||'GilgameshPerestroika1!',
    database:process.env.MYSQLDATABASE||'laramierestoration'
});
db.connect((err) => {if(err) throw err;});
const resources=process.env.resources;
const { resolve } = require('path');
const { nextTick } = require('process');
const { randomUUID } = require('crypto');
const jwtaccess=process.env.ACCESS_TOKEN_SECRET;
const jwtrefresh=process.env.REFRESH_TOKEN_SECRET;
const app=express();
app.use(express.json());
const httpServer=http.createServer(app);
const httpsServer=https.createServer(credentials,app);
httpServer.listen(port,function(){console.log(`Http on port ${port}...`);});
httpsServer.listen(sslport,function(){console.log(`Https on port ${sslport}...`);});

/*----------------
| File Resources |
----------------*/

app.get('/',function(req,res){res.sendFile(__dirname+'/res/laramierestoration.html');});
app.get('/laramierestoration.js',function(req,res){res.sendFile(__dirname+'/res/laramierestoration.js');});
app.get('/laramierestoration.css',function(req,res){res.sendFile(__dirname+'/res/laramierestoration.css');});
app.get('/favicon.svg',function(req,res){res.sendFile(__dirname+'/res/favicon.svg');});
app.get('/page/:resource',function(req,res){res.sendFile(__dirname+'/res/page/page'+req.params.resource+'.js');});

/*-----------------
| Data Processors |
-----------------*/

/*---------------
| House Listing |
---------------*/
app.get('/image/:resource',function(req,res){
    if(!req.params.resource instanceof String&&typeof req.params.resource!='string') return res.status(403).send({error:'Wizards Only, Fools!'});
    //Should store different media types, extension must be included.
    res.sendFile(__dirname+'/res/images/'+req.params.resource);
});
app.post('/homes',async(req,res)=>{
    //Retrieve the listings
    //First, get filter data
    var minbedrooms=0;
    var maxbedrooms=5;
    var minbathrooms=0;
    var maxbathrooms=5;
    var type='';
    var outoftown=false;
    var sold=false;
    var title='';
    var offset=0;
    if(!isNaN(req.body.minbedrooms))minbedrooms=req.body.minbedrooms;
    if(!isNaN(req.body.maxbedrooms))maxbedrooms=req.body.maxbedrooms;
    if(!isNaN(req.body.minbathrooms))minbathrooms=req.body.minbathrooms;
    if(!isNaN(req.body.maxbathrooms))maxbathrooms=req.body.maxbathrooms;
    if(!isNaN(req.body.offset))offset=req.body.offset;
    if(req.body.type instanceof String||typeof req.body.type=='string')type=req.body.type;
    if(req.body.outoftown==true)outoftown=true;
    if(req.body.sold==true)sold=true;
    if(req.body.title instanceof String||typeof req.body.title=='string')title=req.body.title;
    var sql='SELECT * FROM home where bedrooms >= ? AND bedrooms <= ? AND bathrooms >= ? AND bathrooms <= ?';
    var lambdas=[mindbedrooms,maxbedrooms,minbathrooms,maxbathrooms];
    if(!sold){sql+=' AND sold = 0';imagesql+=' AND home.sold = 0'}
    if(title!=''){
        sql+=' AND title = ?';
        lambdas.push(title);
    }
    if(type!=''){
        sql+=' AND type = ?';
        lambdas.push(type);
    }
    if(outoftown){
        sql+=' AND outoftown = 1';
    }
    lambdas.push(offset);
    sql+=' ORDER BY id ASC LIMIT 10 OFFSET ?';
    const homes=await sendquery(sql,lambdas);
    if(homes==null)return res.status(403).send({error:'Wizards Only, Fools!'});
    if(homes.length==0)return res.send({homes:[]});
    sql='SELECT * FROM image WHERE';
    lambdas=[];
    var i=0;
    var requireor=false;
    //Put together sql request for images
    while(i<homes.length){
        if(homes[i].id instanceof String||typeof homes[i].id=='string'){
            if(requireor)sql+=' OR';else requireor=true;
            sql+=' homeid = ?';
            lambdas.push(homes[i].id);
        }
        i++;
    }
    sql+=' ORDER BY homeid ASC';
    if(lambdas.length==0)return res.status(403).send({error:'Wizards Only, Fools!'});
    const images=await sendquery(sql,lambdas);
    if(images==null||images.length==0)res.send({homes:homes});
    i=0;
    var j=0;
    while(i<images.length&&j<homes.length){
        if(images[i].homeid instanceof String||typeof images[i].homeid=='string'){
            while(images[i].homeid!=homes[j].id){
                
                j++;
            }
        }
        i++;
    }
});
app.post('/home/:resource',function(req,res){
    //Retrieve the data for a single home
    if(req.params.resource){
        
    } else res.status(403).send({error:'Wizards Only, Fools!'});
});
app.get('/homes/:resource',function(req,res){
    //Get, to enable url-link

});

/*-------
| Login |
-------*/

app.post('/new/:persontype',async(req,res)=>{
    if(req.params.persontype!='buyer'&&req.params.persontype!='seller'&&req.params.persontype!='agent')return res.status(403).send({error:'Wizards Only, Fools!'});
    if(req.params.persontype=='agent'&&req.body.agentcode!=agentcode)return res.status(403).send({error:'Wizards Only, Fools!'});
    var username='';
    var password='';
    var email='';
    var phone='';
    var name='';
    if(req.body.username instanceof String||typeof req.body.username=='string')username=req.body.username;
    if((req.body.password instanceof String||typeof req.body.password=='string')&&req.body.password.length>=8)password=req.body.password;
    if((req.body.email instanceof String||typeof req.body.email=='string')&&req.body.email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/))email=req.body.email;
    if((req.body.phone instanceof String||typeof req.body.phone=='string')&&req.body.phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im))phone=req.body.phone;
    if((req.body.name instanceof String||typeof req.body.name=='string')&&req.body.name.match(/^[A-Z][a-zA-z\-'] [A-Z][a-zA-z\-']$/))name=req.body.name;
    if(username=='')username=email;
    if(username==''||name==''||password==''||(email==''&&phone==''))return res.status(403).send({error:'Wizards Only, Fools!'});
    const usermatch=await sendquery('SELECT * FROM '+req.params.persontype+' WHERE (email = ? AND email <> "") OR (phone = ? AND phone <> "") OR username = ?',[email,phone,username]);
    if(usermatch==null)return res.status(500).send({error:'Server Error'});
    if(usermatch[0]!=null)return res.status(403).send({error:'Wizards Only, Fools!'});
    //At this point, there is no match and user is valid, start sending out info
    var id=uuid.v4();
    var emailcode='';
    var phonecode='';
    const chars='0123456789ABCDEF';
    if(email!=''){
        var i=0;
        while(i<10){
            emailcode+=chars[Math.floor(Math.random()*16)];
            i++;
        }
    }
    if(phone!=''){
        var i=0;
        while(i<10){
            phonecode+=chars[Math.floor(Math.random()*16)];
            i++;
        }
    }
    const hashedpassword=await bcrypt.hash(req.body.password,10);
    await sendquery('INSERT INTO '+req.params.persontype+' (id,username,password,name,email,phone,emailcode,phonecode) VALUES (?,?,?,?,?,?,?,?)',[username,hashedpassword,name,email,phone,emailcode,phonecode]);
    return res.send({success:true});
});
app.get('/verify/:persontype/:username/:verifycode',async(req,res)=>{
    //First, check general formatting
    if(req.params.persontype!='buyer'&&req.params.persontype!='seller'&&req.params.persontype!='agent')return res.status(403).send({error:'Wizards Only, Fools!'});
    if((!req.params.verifycode instanceof String&&typeof req.params.verifycode!='string')||!req.params.verifycode.match(/^[0-9a-fA-F]{10}$/))return res.status(403).send({error:'Wizards Only, Fools!'});
    if(!req.params.username instanceof String||typeof req.params.username!='string')return res.status(403).send({error:'Wizards Only, Fools!'});
    const user=await sendquery('SELECT * FROM '+req.params.persontype+' WHERE username = ?',[req.params.username]);
    if(user==null||user[0]==null)return res.status(403).send({error:'Wizards Only, Fools!'});
    //Potentially validate player
    if(user[0].emailcode==req.params.verifycode){
        await sendquery('UPDATE '+req.params.persontype+' SET emailcode = "" WHERE username = ?',[req.params.username])
        return res.send({success:'Email successfully validated!'});
    }
    if(user[0].phonecode==req.params.verifycode){
        await sendquery('UPDATE '+req.params.persontype+' SET phonecode = "" WHERE username = ?',[req.params.username])
        return res.send({success:'Phone successfully validated!'});
    }
    if(user[0].phonecode==''&&user[0].emailcode=='')return res.send({success:'Already validated!'});
    return res.status(403).send({error:'Wizards Only, Fools!'});
});
app.post('/resend/:persontype',async(req,res)=>{
    //Resends email and/or sms

});
app.post('/login/:persontype',async(req,res)=>{
    if(req.body.username==null||req.body.email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)==false) {res.status(400).send({error:'Invalid Email'});return;}
    if(req.body.password==null||req.body.password.length<8) {res.status(400).send({error:'Invalid Password'});return;}
    const user=await sendquery('SELECT * FROM player WHERE email = ?',[req.body.email]);
    if(user==null) {res.status(500).send({error:'Server Error'});return;}
    if(user[0]==null) {res.status(400).send({error:'Invalid Email'});return;}
    if(user[0].password==null) {res.status(500).send({error:'Server Error'});return;}
    if(await bcrypt.compare(req.body.password,user[0].password)){
        var player={email:req.body.email};
        if(user[0].name)player.name=user[0].name;
        const accesstoken=jwt.sign({username:req.body.username,password:req.body.password},jwtaccess);
        user[0].token=accesstoken;
        user[0].password=null;
        res.send(user[0]);
    }else{res.status(400).send({error:'Invalid Password'});}
});
function authenticateToken(req,res,next) {
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    if(token==null) return res.sendStatus(401);
    jwt.verify(token,jwtaccess,(err,user)=>{
        if(err) return res.sendStatus(403);
        if(user.username!=username||username==''||user.password!=password||password=='') return res.status(403).send({error:'Wizards Only, Fools!'});
        req.user.username=user.username;
        req.user.password=user.password;
        next();
    });
}
async function authenticateAgent(req,res,next){//fed from authenticatetoken
    const user=await sendquery('SELECT * FROM agent WHERE username = ?',[req.user.username]);
    if(user==null||user[0]==null)return res.status(403).send({error:'Wizards Only, Fools!'});
    if(await bcrypt.compare(req.user.password,user[0].password)){
        if(user[0].phone!=null&&user[0].phone!='')req.user.phone=user[0].phone;
        if(user[0].name!=null&&user[0].name!='')req.user.name=user[0].name;
        if(user[0].id!=null&&user[0].id!='')req.user.id=user[0].id;
        next();
    } else {
        return res.status(403).send({error:'Wizards Only, Fools!'});
    }
}
async function authenticateBuyer(req,res,next){//fed from authenticatetoken
    const user=await sendquery('SELECT * FROM buyer WHERE username = ?',[req.user.username]);
    if(user==null||user[0]==null)return res.status(403).send({error:'Wizards Only, Fools!'});
    if(await bcrypt.compare(req.user.password,user[0].password)){
        if(user[0].phone!=null&&user[0].phone!='')req.user.phone=user[0].phone;
        if(user[0].name!=null&&user[0].name!='')req.user.name=user[0].name;
        if(user[0].id!=null&&user[0].id!='')req.user.id=user[0].id;
        next();
    } else {
        return res.status(403).send({error:'Wizards Only, Fools!'});
    }
}
async function authenticateSeller(req,res,next){//fed from authenticatetoken
    const user=await sendquery('SELECT * FROM seller WHERE username = ?',[req.user.username]);
    if(user==null||user[0]==null)return res.status(403).send({error:'Wizards Only, Fools!'});
    if(await bcrypt.compare(req.user.password,user[0].password)){
        if(user[0].phone!=null&&user[0].phone!='')req.user.phone=user[0].phone;
        if(user[0].name!=null&&user[0].name!='')req.user.name=user[0].name;
        if(user[0].id!=null&&user[0].id!='')req.user.id=user[0].id;
        next();
    } else {
        return res.status(403).send({error:'Wizards Only, Fools!'});
    }
}