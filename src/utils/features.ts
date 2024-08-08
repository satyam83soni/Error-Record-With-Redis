import mongoose from "mongoose";

import redisClient from "../redis/redis";

class Database{
    // private static async clearRedisCache():Promise <void>{
    //     try {
    //         await redisClient.flushAll();
    //         console.log("Data flushed due to change");
    //     } catch (err) {
            
    //     }
    // }

    private static async connectDB(uri : string) :Promise<void>{
        try {
            const uri: string = 'your_mongo_database_uri_here'; // Replace with your MongoDB connection string
            await mongoose.connect(uri );
            console.log('Connected to MongoDB successfully');
        } catch (error) {
            console.error('Error connecting to MongoDB:', (error as Error).message);
        }
    }


static connecTOtDB = this.connectDB;


}

export default Database