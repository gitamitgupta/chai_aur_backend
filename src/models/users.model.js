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

userSchema.pre("save",async function (next) {
   // using in build function 
if(!this.isModified("password")) next();
       this.password=  await bcrypt.hash(this.password,10);
     next();
   })

userSchema.methods.isPasswordCorrect= async function (password) {
  await bcrypt.compare(password,this.password)
   
}
// this part is good you have think about this 
userSchema.methods.generateAccessToken= function(){
   return jwt.sign({
   _id:this._id,
   email:this.email,
   username:this.username,
   fullname: this.fullname
  },process.env.ACCESS_TOKEN_SECRET,{
   expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  })
}
userSchema.methods.generateRefreshToken= function(){
   return jwt.sign({
   _id:this._id,
   
  },process.env.REFRESH_TOKEN_SECRET,{
   expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  })
}


export const User = mongoose.model("User",userSchema)