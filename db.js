var mongoose = require('mongoose')
var DB_NAME = "15th_APPJAM"
var schema = mongoose.Schema;
var db = mongoose.connect("mongodb://localhost/"+DB_NAME, (err)=>{
    if(err){
        throw err
    }
    else {
        console.log('DB Connect Success')
    }
})

var User_Schema = new schema({
    username : {type : String},
    id : {type : String},
    password : {type : String},
    usertoken : {type : String},
    guardiantoken : {type : String},
    fcmtoken : {type : String},
    usertype : {type : Boolean}
})

var Danger_Schema = new schema({
    latitude : {type : String},
    longitude : {type : String},
    time : {type : String},
    address : {type : String},
    id : {type : String}
})

var User = mongoose.model('user', User_Schema)
var Danger = mongoose.model('danger', Danger_Schema)


exports.db = db
exports.User = User
exports.Danger = Danger
