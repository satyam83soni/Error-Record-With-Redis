import mongoose from "mongoose";

class Database {
  private static async connectDB(): Promise<void> {
    try {
      await mongoose.connect("mongodb+srv://satyam:ZjevYfDzzUqCH1Qj@cluster0.k7sgg2s.mongodb.net/dice-roll?retryWrites=true&w=majority&appName=Cluster0");
      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("Error connecting to MongoDB:", (error as Error).message);
    }
  }

  static connecTOtDB = this.connectDB;
}

export default Database;
