import { Request, Response, NextFunction } from "express";
import { ErrorLog } from "../models/error";
import Bull from "../redis/emailQueue";
import { IErrorLog } from "../models/error";

class Middleware {
  private static errorMiddleware(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  private static async logErrorToDatabaseAndQueue(
    error: IErrorLog
  ): Promise<void> {
    const errorDetails = {
      name: error.name,
      message: error.message,
      code: error.code || null,
      errno: error.errno || null,
      path: error.path || null,
      syscall: error.syscall || null,
      stack: error.stack,
      resolved: false,
      platform: error.platform,
    };

    try {
      await ErrorLog.create(errorDetails);
    } catch (dbError) {
      console.error("Error logging to database:", dbError);
    }
    try {
      await Bull.pushToQueue(errorDetails);
    } catch (error) {
      console.log("Queue pushing error", error);
    }
  }

  private static TryCatch(
    fn: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<void | Response>
  ) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        await fn(req, res, next);
      } catch (error: any) {
        await this.logErrorToDatabaseAndQueue(error);
        next(error);
      }
    };
  }

  static wrap = this.TryCatch;
  static getError = this.errorMiddleware;
}

export default Middleware;
