import mongoose from "mongoose";

export async function connectDb(){
    try {
       const connection = await mongoose.connect(process.env.MONGODB_URI!,{
        maxConnecting: 10,
       } as mongoose.ConnectOptions)
       if(connection){
        console.log('Connected to MongoDB 🗃️');
       }else{
        console.error('Failed to connect to MongoDB 👹');
        process.exit(1);
       }
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
}