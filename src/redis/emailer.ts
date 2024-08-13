import { Worker, Queue, WorkerOptions } from "bullmq";
import nodemailer from "nodemailer";
import { createClient } from "redis";
import Bull from "./emailQueue";
import Middleware from "../middlewares/error";
import { ErrorDetails } from "../utils/types"
import { Job } from "bullmq";
import { ApiError } from "../utils/apiError";

class EmailProcessor {
  private static transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'monserrate.daniel@ethereal.email',
        pass: '7x7wAmESScdwdFZ6um'
    }
  });

  // Configure Redis connection
  

  

  private static worker = new Worker(
    "email-queue",
    async (job: any): Promise<void> => {
      try {
        await this.main(job);
        console.log("Mail Sent");
      } catch (error) {
        console.error("Error processing job:", error);
      }
    },{ connection: {
      host: "redis-server",
      port: 6379
    }}
  );

  private static async main(job:Job) {
    if(!job.data?.text?.toUser){
      try {
        const { subject, text } = job.data;
        const info = await this.transporter.sendMail({
          from: '"Ambresh Kumar" <monserrate.daniel@ethereal.email>',
          to: "satyam73soni@gmail.com",
          subject: subject,
          text: `So here new error came into role with name ${text.name} and the code of the error is ${text.code} and the error message is ${text.message} and the error number is ${text.errno} and the path for the message is ${text.path} and the syscall is ${text.syscall} and the platform for the error is ${text.platform}`,
        });
        console.log("Message sent to Platform: %s", info.messageId);
      } catch (err:any) {     
        throw  new ApiError(400 , "Error sending mail to platform" )
      }
    }
    else{
      try {
        const { subject, text } = job.data;
        const info = await this.transporter.sendMail({
          from: '"Ambresh Kumar" <monserrate.daniel@ethereal.email>',
          to:text?.userEmail ,
          subject: subject,
          text: `Sorry for the inconvenience  ${text.userName} and we will resolve the error as soon as possible , thankyou for you patience team ${text.platform}`,
        });
        console.log("Message sent to User: %s", info.messageId);
      } catch (err:any) {     
       throw new ApiError(400 , "Error sending mail to User" , err );
      }
    }
   
  }

  static runWorker(){
    console.log("worker started");
  };
}

export default EmailProcessor;
