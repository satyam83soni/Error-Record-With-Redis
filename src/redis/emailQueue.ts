import { Queue } from "bullmq";
import { ApiError } from "../utils/apiError";

const notificationQueue = new Queue("email-queue", { connection: {
  host: "redis-server",
  port: 6379
}});
class Bull {
  private static async init(error: any) {
    try {
      const res = await notificationQueue.add("mail the error", {
        email: "satyam73soni@gmail.com",
        subject: "Regaurding the error at backend server",
        text: {
          name: error?.name,
          message: error?.message,
          code: error?.code,
          errno: error?.errno,
          path: error?.path,
          syscall: error?.syscall,
          stack: error?.stack,
          resolved: false,
          platform: error?.platform,
        },
      });
    } catch (err) {
      throw new ApiError(401, "Unable to add in  queue notifiction");
    }
  }
  static pushToQueue = this.init;
}

export default Bull;
