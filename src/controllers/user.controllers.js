import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apierror.js"
import { User } from "../models/users.model.js"
import { uploadOncloudinary } from "../utils/cloudinary.js"
import {Apiresponce}  from "../utils/apiresponce.js"
const generateAccessAndRefereshToken=async(userId)=>{
 try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refereshToken = user.generateRefreshToken();
    // puting the refersehtoken in mongoose data base 
    user.refreshToken= refereshToken
    await user.save({validateBeforeSave: false});

    return {accessToken,refereshToken}
   } 
 catch (error) {
    throw new ApiError(500,"somthing went wrong while generating referesh and access token")
 }
}


const registerUser = asyncHandler(async (req, res) => {

    // get user details form frontend 
    const { fullname, email, username, password } = req.body
    

    // validation --not empty 
   if ([fullname, email, username, password].some(field =>!field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
 }

    //check if user exists : user name / email
   const existsUser = await User.findOne({
    $or: [{ username }, { email }] 
   })
   if (existsUser) {
    throw new ApiError(409, "user is alrady exist")
    }
   // check for images ,check for avatar
   // req.files return the array of 1 data  which is object contion
    const avatarlocalpath = req.files?.avatar[0].path
    const coverImagelocalpath = req.files?.coverImage[0].path
     if (!avatarlocalpath) {
    throw new ApiError(400, "avtar feild is required")
    }
    // upload on cloudinary ,avatar AND check for avatar 
    const avatar = await uploadOncloudinary(avatarlocalpath)
     let coverImage;
    if (coverImagelocalpath) {
        coverImage = await uploadOncloudinary(coverImagelocalpath);
    }
    //check
    if (!avatar) {
    throw new ApiError(400, "avater is not upload")
    }
     //create a user object - create entry in db 
    const user = await User.create(
    {
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase() ,
    email,
    password
     }
    )
    // REMOVE password and refeace token from the responce 
    const createuser= await User.findById(user._id).select("-password -refreshToken")
    if (!createuser) {
        throw new ApiError(500," something went wrong user is not created")
    }
   b // return response 
   return res.status(201).json(
    new Apiresponce(200,createuser,"user is successfully create ")
 )
 

});
// here i will write the login controllers
const loginUser = asyncHandler( async(req,res)=>{
    // send cookis 
     //req body se data
    const {email,username,password}=req.body
    if(!email || !username){
        throw new ApiError(400,"username or email is required");
    }
      // user or email
       // find the user 
    const user = await User.findOne({
  $or: [{ email }, { username }]
   });

    if(!user) {
        throw new ApiError(404,"user does not exist");
        
    }
    // password validtion
   const isPasswordValid =await user.isPasswordCorrect(password);

   if(!isPasswordValid)
    {
      throw new ApiError(401,"user password is invalid")
    }
    // access and referesh token 
    // create the function that generate token
   const userId= user._id
   const {accessToken,refereshToken}=  generateAccessAndRefereshToken(userId)
 const loginUser= await User.findById(userId).select(
    "-password -refereshToken")
// option for secure cookices
    const option={
        httpOnly:true,
        secure:true
    }
// send cookis
    return
    res.status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refereshToken",refereshToken,option)
    .json(
        new Apiresponce(
            200,
            {
                user : loginUser , accessToken, refereshToken

            },
            " user logged in successfully"
        )
    )
});
 const logoutUser= asyncHandler(async(req,res)=>{
    // req.user come form middlewear
  const userId= req.user._id;
  await User.findByIdAndUpdate(userId,{
    $set:{
        refreshToken:undefined
    }
  },
  {
    new:true
  }

)

 const option={
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .clearcookie("accessToken",option)
    .clearcookie("refereshToken",option)
    .json(new Apiresponce(200,{},"user logged out"))
 })
export { registerUser,
    loginUser,
    logoutUser
 };