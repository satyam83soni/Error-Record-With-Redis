import { z } from "zod";
import { IErrorLog } from "../models/error";
import Error from "../middlewares/error";

class Validation {
  private static errorLogSchema = z.object({
    name: z.string().min(1, "Name is required"),
    message: z.string().min(1, "Message is required"),
    code: z.string().nullable().optional(),
    errno: z.number().nullable().optional(),
    path: z.string().nullable().optional(),
    syscall: z.string().nullable().optional(),
    stack: z.string().min(1, "Stack trace is required"),
    resolved: z.boolean().default(false),
    timestamp: z.date().default(() => new Date()),
    platform: z.string().default("Grovyo"),
  });

  private static safeParsed(error: any) {
    try {
      const parsed = Validation.errorLogSchema.parse(error);
      return parsed;
    } catch (err) {
      console.log(error);
    }
  }

  static safeParse = Validation.safeParsed;
}

export default Validation;
