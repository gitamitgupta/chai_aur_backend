import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apierror.js"
import { User } from "../models/users.model.js"
import { uploadOncloudinary } from "../utils/cloudinary.js"
import {Apiresponce}  from "../utils/apiresponce.js"
const registerUser = asyncHandler(async (req, res) => {

    // get user details form frontend 
    const { fullname, email, username, password } = req.body
    console.log("email: ", email);
    // validation --not empty 
    if ([fullname, email, username, password].some((field) => {
        field?.trim() === ""
    })) {
        throw new ApiError(200, "All field are required")
    }
    //check if user exists : user name / email
   const existsUser = User.findOne({
    $or: [{ username }, { email }]
   })
   if (existsUser) {
    throw new ApiError(409, "user is alrady exist")
    }
   // check for images ,check for avatar
    const avatarlocalpath = req.files?.avatar[0].path
    const coverImagelocalpath = req.files?.coverImage[0].path
     if (!avatarlocalpath) {
    throw new ApiError(400, "avtar feild is required")
    }
    // upload on cloudinary ,avatar AND check for avatar 
    const avatar = await uploadOncloudinary(avatarlocalpath)
     const coverImage = await uploadOncloudinary(coverImagelocalpath)
    //check
    if (!avatar) {
    throw new ApiError(400, "avater is not upload")
    }
     //create a user object - create entry in db 
    const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.tolowerCase(),
    email,})
    // REMOVE password and refeace token from the responce 
    const createuser= await User.findById(user._id).select("-password -refreshToken")
    if (!createuser) {
        throw new ApiError(500," something went wrong user is not created")
    }
   // return response 
   return res.status(201).json(
    new Apiresponce(200,createuser,"user is successfully create ")
   )
});

export { registerUser };
