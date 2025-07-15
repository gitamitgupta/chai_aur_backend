
// high order funtion (that take fuction as parmeter )
const asynchandler= async( requestHandler)=>{
     return (req , res, next)=>{
        Promise.resolve( requestHandler(req,res,next)).catch((err)=>next(err));
    }

}

export default asynchandler;