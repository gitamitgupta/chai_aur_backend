import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
 username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
 },
 email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
    
 },
 fullname:{
     type:String,
     required:true,
     trim:true,
     index:true

 },
 avatar:{
    type:String,// cloudeinary url
    required:true,

 },
  coverImage:{
    type:String,// cloudeinary url
 },
 // array of object 
 watchHistory:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }
 ],
 password:{
    type:String,
    required:[true,"password is required"]
 },
 refreshToken:{
    type: String
 }




},{ timestamps :true })
// In Mongoose, a pre middleware is a function that runs before a certain Mongoose lifecycle event 
// (like save, validate, remove, etc.) is executed on a document or query.
// use normal function because in arrow function there is no (this) refrence.
userSchema.pre("save",async function (next) {
   if(!this.isModified("password")) next();
     this.password= bcrypt.hash(this.password,10);
     next();
   
})
export const User = mongoose.model("User",userSchema)