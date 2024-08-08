import { Request, Response, NextFunction } from "express";
import {ErrorLog} from "../models/error";
import redisClient from "../redis/redis";
class Error {
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

  private static async logErrorToDatabaseAndQueue(error: any): Promise<void> {
    const errorDetails = {
      name: error.name,
      message: error.message,
      code: error.code || null,
      errno: error.errno || null,
      path: error.path || null,
      syscall: error.syscall || null,
      stack: error.stack,
      resolved: false,
    };

    try {
      await ErrorLog.create(errorDetails);
    } catch (dbError) {
      console.error("Error logging to database:", dbError);
    }

    try {
      await redisClient.rPush("errorQueue", JSON.stringify(errorDetails));
    } catch (redisError) {
      console.error("Error pushing to Redis queue:", redisError);
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
        await Error.logErrorToDatabaseAndQueue(error);
        next(error);
      }
    };
  }

  static wrap = Error.TryCatch;
  static getError = Error.errorMiddleware;
}

export default Error;
