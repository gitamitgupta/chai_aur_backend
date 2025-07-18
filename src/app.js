import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";                
const app= express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json())

// routes 
import userrouter from "./routes/user.routes.js";
app.use("/api/v1/user",userrouter)


export default app;

