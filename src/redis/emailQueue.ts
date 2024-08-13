import { Queue } from "bullmq";
import { ApiError } from "../utils/apiError";
import { ErrorDetails } from "../utils/types";
const notificationQueue = new Queue("email-queue", {
  connection: {
    host: "redis-server",
    port: 6379,
  },
  defaultJobOptions: {
    attempts: 2, 
  },
});



class Bull {
  private static async init(error :any) {
    try {
      const res = await notificationQueue.add("mail the error", {
        email: "satyam73soni@gmail.com",
        subject: "Regaurding the error at backend server",
        text: {
          name: error?.name,
          userName :error?.userName,
          userEmail: error.userEmail,
          message: error?.message,
          code: error?.code,
          errno: error?.errno,
          path: error?.path,
          syscall: error?.syscall,
          stack: error?.stack,
          resolved: false,
          platform: error?.platform,
          toUser:false
        },
      });
    } catch (err) {
      throw new ApiError(401, "Unable to add in  queue notifiction");
    }
  }

  private static async  init2(error:ErrorDetails){
    try {
      const res = await notificationQueue.add("mail the error", {
        email: error.userEmail,
        subject: "Regaurding the error at backend server",
        text: {
          name: error?.name,
          userName :error?.userName,
          userEmail: error.userEmail,
          platform: error?.platform,
          toUser:true,
        },
      });
    } catch (err) {
      throw new ApiError(401, "Unable to add in  queue notifiction");
    }
  }



  static pushToAdminQueue = this.init;
  static pushUserQueue = this.init2;

}

export default Bull;
