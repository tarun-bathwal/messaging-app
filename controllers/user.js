const mongoose=require('mongoose');
const nodemailer = require("nodemailer");
const Users=require('../models/user').Users;
const bcrypt=require('bcrypt');
const expressJwt = require('express-jwt');
const jwt=require('jsonwebtoken');
const crypto = require('crypto');

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "your gmail id",
        pass: "corresponding password"
    }
});
var rand,mailOptions,host,lin


exports.register= function (req,res) {
    Users.find({email: req.body.email},function(err,data){
        if(data.length>=1 && data[0]['verified']==1){
            return res.status(409).json({
                success:false,
                message: 'user already exists'
            });
        }
        else if (data.length>=1 && data[0]['verified']==0){
            return res.status(409).json({
                success:false,
                message: 'please verify your email address by clicking the link sent on your mail'
            }); 
        }
        else{
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'sorry! something happened, please try again'
                    });
                } else {
                    
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
                    user.save(function (err, result) {
                        if (err) {
                            res.status(500).json({
                                success: false,
                                message: 'sorry! something happened, please try again'
                            });
                        }else{
                            rand=Math.floor((Math.random() * 100) + 54);
                            host=req.get('host');
                            link="http://"+req.get('host')+"/verify?id="+val+"&email="+req.body.email;
                            mailOptions={
                                to : req.body.email,
                                subject : "Please confirm your Email account",
                                html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
                            }
                            console.log(mailOptions);
                            smtpTransport.sendMail(mailOptions, function(error, response){
                                if(error){
                                       console.log(error);
                                   //res.end("error unable to send verification email.");
                                        res.status(500).json({
                                        success: false,
                                        message: 'registered but UNABLE to send verification email'
                                    });
                                }
                                else{
                                    res.status(200).json({
                                        success: true,
                                        message: 'sucessfully registered. Verify your email id.'
                                    });
                                }
                           });
                            
                        }
                    });
                }
            });
        }
    });

};

exports.verify= function(req,res){
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        Users.find({"email": req.body.email , "verifytoken" : req.body.id},function(err,data){
        if(!err)
        {
            console.log("email is verified and token verified");
            console.log(req.query.email);
            var query = {'email' : req.query.email};
            console.log(query);
            
            var newvalues = { $set : {'verified':1}};
            console.log(newvalues);
            Users.update(query,newvalues,function(err,result){
                if(err){
                    res.status(500).json({
                        success: false,
                        message: 'email not verified .try again'
                    });
                }
                else{
                    res.status(200).json({
                        success: true,
                        message: 'sucessfully verified your email id.'
                    });
                }
            });
            
        }
        else{
            res.status(500).json({
                success: false,
                message: 'email not verified because of wrong token'
            });
        }
    });
    }
    else{
        res.status(500).json({
            success: false,
            message: 'request from unknown source'
        });
    }
}
