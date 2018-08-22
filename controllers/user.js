const mongoose=require('mongoose');
const nodemailer = require("nodemailer");
const Users=require('../models/user').Users;
const BlockedUsers=require('../models/user').BlockedUsers;
const Chats=require('../models/user').Chats;
const bcrypt=require('bcrypt');
const expressJwt = require('express-jwt');
const jwt=require('jsonwebtoken');
const crypto = require('crypto');

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "email",
        pass: ""
    }
});
var rand,mailOptions,host,lin


exports.register= async function (req,res) {
    try{
        data=await Users.find({email: req.body.email});
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
        return;
    }
    if(data.length>=1 && data[0]['verified']==1){
        return res.status(409).json({
            success:false,
            message: 'user already exists'
        });
        return;
    }
    else if (data.length>=1 && data[0]['verified']==0){
        return res.status(409).json({
            success:false,
            message: 'please verify your email address by clicking the link sent on your mail'
        });
        return; 
    }
    else{
        if(req.body.password==='' || req.body.password===undefined){
            res.status(409).json({
                success:false,
                message:"password cannot be empty"
            });
            return;
        }
        try{
            hash=await bcrypt.hash(req.body.password, 10);
        }catch(err){
            res.status(500).json({
                success:false,
                message:err.message
            });
            return;
        }                    
        var rand=Math.floor((Math.random() * 100) + 54);
        rand= rand.toString();
        var val = crypto.createHash('md5').update(rand).digest('hex');
        console.log(val);
        
        var user = new Users({
            _id: new mongoose.Types.ObjectId(),
            firstname: req.body.firstname,
            lastname:req.body.lastname,
            email: req.body.email,
            username:req.body.username,
            password: hash,
            verified : 0,
            verifytoken : val
        });
        try{
            result = await user.save();
        }catch(err){
            res.status(500).json({
                success: false,
                message: err.message
            });
            return;
        }
        rand=Math.floor((Math.random() * 100) + 54);
        host=req.get('host');
        link="http://"+req.get('host')+"/verify?id="+val+"&email="+req.body.email;
        mailOptions={
            to : req.body.email,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
        }
        console.log(mailOptions);
        try{
            response=await smtpTransport.sendMail(mailOptions);
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'registered but UNABLE to send verification email'
            }); 
            return;
        }
        res.status(200).json({
            success: true,
            message: 'sucessfully registered. Verify your email id.'
        });          
    }
}

exports.verify= async function(req,res){
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        try{
            console.log("token in url "+req.query.id);
            data=await Users.find({"email": req.query.email , "verifytoken" : req.query.id});
        }catch(err){
            res.status(500).json({
                success:false,
                message:err.message
            });
            return;
        }
        if(data.length<1){
            res.json({
                success:false,
                message:"key is invalid"
            });
            return;
        }
        console.log("email is verified and token verified");
        console.log(req.query.email);
        var query = {'email' : req.query.email};
        console.log(query);
        var newvalues = { $set : {'verified':1}};
        console.log(newvalues);
        try{
            result=await Users.update(query,newvalues);
        }catch(err){
            res.status(500).json({
                success:false,
                message:err.message
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'sucessfully verified your email id.'
        });
        return;
    }
    else{
        res.status(500).json({
            success: false,
            message: 'request from unknown source'
        });
        return;
    }
}


exports.login= async function (req,res) {
    try{
        data= await Users.find({email: req.body.email});
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
    if(data.length<1){
        return res.status(401).json({
            success: false,
            message: "email id doesn't exist"
        });
    }
    else if (data.length==1 && data[0]['verified']==0){
        return res.status(401).json({
            success: false,
            message: 'verify your email by clicking on link sent on your mail before logging in with this email id.'
        });
    }
    else{
        try{
            result=await bcrypt.compare(req.body.password,data[0].password);
        }catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
        if(result){
            var token= jwt.sign({
                email: data[0].email,
                userId: data[0]._id
            },
                'secret',
                {expiresIn:"72h"}
                );
            return res.status(200).json({
                success: 'successfully logged in',
                token: token
            });
        }else {
            return res.status(401).json({
                success: false,
                message: 'invalid password'
            });
        }
    }
}

exports.blockuser= async function(req,res){
    var Username=req.params.username;
    var currentuser = req.userData.userId;
    var blockId;
    try{
        data= await Users.find({username: Username});
    }catch(err){
        json.status(500).json({
            success:false,
            message:err.message
        });
        return;
    }
    if(data.length<1){
        res.status(200).json({
            success:false,
            message:"user with username "+Username+" was not found"
        });
        return;
    }
    blockId=data[0]._id;
    try{
        result=await BlockedUsers.findOne({userid:currentuser});
    }catch(err){
        json.status(500).json({
            success:false,
            message:err.message
        });
        return;
    }
    if(result==undefined){
        var entry= new BlockedUsers({
            _id: new mongoose.Types.ObjectId(),
            userid:currentuser,
            blocked:blockId
        });
        try{
            result = await entry.save();
        }catch(err){
            json.status(500).json({
                success:false,
                message:err.message
            });
            return;
        }
        res.json({
            success:true,
            message:Username+" has been blocked"
        });
        return;
    }
    else{
        try{
            result=await BlockedUsers.updateOne({userid:currentuser},{ $push: { blocked: blockId } });
        }catch(err){
            json.status(500).json({
                success:false,
                message:err.message
            });
            return;
        }     
        res.status(200).json({
        success: true,
        message: ""+Username+" has been blocked"
        });
    }    
}


exports.SendMessage = async (req,res)=>{
    var from = req.userData.userId;
    var Username = req.body.to;
    var subject = req.body.subject;
    var content = req.body.content;
    if(Username===undefined){
        res.json({
            success:false,
            message:"username cannot be empty"
        });
        return;
    }
    try{
        data= await Users.find({username: Username});
    }catch(err){
        json.status(500).json({
            success:false,
            message:err.message
        });
        return;
    }
    if(data.length<1){
        res.status(200).json({
            success:false,
            message:"user with username "+Username+" was not found"
        });
        return;
    }
    var to=data[0]._id;
    try{
        result = await BlockedUsers.find({userid:to});
    }catch(err){
        json.status(500).json({
            success:false,
            message:err.message
        });
        return;
    }
    console.log(result);
    console.log(from);
    console.log(result[0].blocked.indexOf(from));
    if(result.length>=1){
        if(result[0].blocked.indexOf(from)!=-1)
        {
            res.status(200).json({
                success:false,
                message:Username+" has blocked you. Cannot send message."
            });
            return;

        }
    }
    var msg= new Chats({
        _id: new mongoose.Types.ObjectId(),
        from:from,
        to:to,
        subject:subject,
        content:content
    });
    try{
        result=await msg.save();
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
        return;
    }
    res.json({
        success:true,
        message:"sent the message to "+Username
    });                                       
}

exports.inbox= async (req,res)=>{
    currentuser=req.userData.userId;
    try{
        data=await Chats.find({to:currentuser});
        var map = {};
        var result;
        var msg=[];
        try{
            result=await Users.find({});
            result.forEach(element => {
                map[element._id]=element.username;
            });
        }
        catch(err){
            res.json({
                success:false,
                message:err.message
            });
            return;
        }
        var newobj;
        data.forEach(element => {
            newobj={
                from:map[element.from],
                subject:element.subject,
                content:element.content
            }
            msg.push(newobj);
        });
        res.json({
            success:true,
            message:msg
        });
    }catch(err){
        res.json({
            success:false,
            message:err.message
        });
    }   
}