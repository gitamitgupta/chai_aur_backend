import app from "./app.js";
import db_connection from "./db/index.js";
import dotenv from 'dotenv'
dotenv.config();

db_connection().then(
app.listen(process.env.PORT || 5000,()=>{
    console.log(`server is ruinning on http://localhost:${process.env.PORT}`)
})

).catch((err)=>{
    console.log("bhai error aggya",err);
    
})
