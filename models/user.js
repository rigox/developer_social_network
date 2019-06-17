const mongoose = require("mongoose")
const Schema =  mongoose.Schema

const userSchema = new Schema({
 name:{
      type:String,
      require:true
 },
 email:{
      type:String,
      require:true,
      unique:true
 },
 password:{
      type:String,
      require:true
 },
 avatar:{
      type:String
 },
 date:{
       type:Date,
       default: new Date().toUTCString()
 }

});


const User  =  mongoose.model('user',userSchema);

module.exports = User ;
