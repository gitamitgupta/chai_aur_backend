import asynchandler from "./src/utils/asynchandler.js";


const registerUser= asynchandler(async ( req,res)=>{
 res.status(200).json({
    massage:"ok"
 })
})
export {registerUser};