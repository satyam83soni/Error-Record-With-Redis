import { Worker } from "bullmq";
import nodemailer from "nodemailer";

class EmailProcessor {
  private static transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "maddison53@ethereal.email",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });

  private static worker = new Worker(
    "email-queue",
    async (job: any): Promise<void> => {
      try {
        await this.main(job);
        // console.log("worker started")
        console.log("Mail Sent");
      } catch (error) {
        console.error("Error processing job:", error);
      }
    }
  );

  private static async main(job: any) {
    try {
      const { subject, text } = job.data;
      const info = await this.transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <satyam73soni@gmail.com>',
        to: "ambreshkumarsaini@gmail.com",
        subject: subject,
        text: `So here new error came into role with name ${text.name}  and  the code of the erorr is ${text.code} and the error message is ${text.message} and the  error number is ${text.errno} and the path for the message is ${text.path} and the syscall is ${text.syscall}  and the platform for the error is ${text.platform}`,
      });

      console.log("Message sent: %s", info.messageId);
    } catch (err) {
      console.error("Error sending email:", err);
    }
  }
}

export default EmailProcessor;
