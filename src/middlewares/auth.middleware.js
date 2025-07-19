import { asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apierror.js"
import jwt from "jsonwebtoken"
import {User} from "../models/users.model.js"
try {
     const verifyJWT= asyncHandler(async(req , res, next)=>{
        const token = req.cookies?.accessToken ||
         req.header("Authoriztion")?.replace("Bearer","")
         if(!token){
         throw new ApiError(401,"unauthorized request")
         }
        const decodedtoken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
       const user= await User.findById(decodedtoken?._id).select("-password -refreshToken")
     if(!user){
        throw new ApiError(401,"invalid Access Token")
     }
     // giving the user in req.user
      req.user=user
      next()
    })
} catch (error) {
    throw new ApiError(401,error?.message || "invalid Access token")
    
}
export {verifyJWT}