import dotenv from "dotenv"
dotenv.config()
import { DB_NAME } from "../constants.js"
import mongoose, { mongo } from "mongoose"

  const db_connection =async ()=>{
try {
    const connectionInstance = mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log("connection succesfull",(await connectionInstance).connection.host);
    
    
    
} catch (error) {
   console.log(" db_connection  nhi hua hee side dekho ee error hai",error);
    
}
 }

 export default db_connection;