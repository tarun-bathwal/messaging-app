var mongoose=require('mongoose');

var userSchema= mongoose.Schema({

    
    _id:mongoose.Schema.Types.ObjectId,
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    email: {type:String, required:true, unique:true,
        match:/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/},
    username:{type:String, required:true, unique:true},
    password: {type:String, required:true},
    verified : {type : Number , required:true},
    verifytoken : {type : String, required:true},
});

var users=mongoose.model('users',userSchema);

var blockSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    blocked: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]
});

var blockedusers = mongoose.model('blockedusers',blockSchema);

var chatSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    from:{type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    to:{type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    subject:{type:String},
    content:{type:String, required:true}
});

var chats = mongoose.model('chats',chatSchema);

module.exports={
    Users:users,
    BlockedUsers:blockedusers,
    Chats:chats
}
