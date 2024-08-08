import mongoose from "mongoose";

import redisClient from "../redis/redis";

class Database{
    private static async clearRedisCache():Promise <void>{
        try {
            await redisClient.flushAll();
            console.log("Data flushed due to change");
        } catch (err) {
            
        }
    }
}