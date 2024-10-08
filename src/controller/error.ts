import { ErrorLog } from "../models/error";
import Validation from "../utils/validations";
import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import Middleware from "../middlewares/error";
import Bull from "../redis/emailQueue";
class Controller {
  private static async createError(req: Request, res: Response): Promise<void> {
    //  parsed = Validation.safeParse(req.body);

    // if (!parsed) {
    //   constthrow new ApiError(400, "Parsing of data unsuccessfull");
    // }

    try {
      await Bull.pushToAdminQueue(req.body);
      await Bull.pushUserQueue(req.body);
      console.log("pushed");
    } catch (error) {
      console.log("pushing to queue error", error);
    }
    const error = new ErrorLog(req.body);
    const saved = await error.save();
    res.status(201).json({ msg: "Succcessfull", data: saved });
  }

  private static async findError(req: Request, res: Response): Promise<void> {
    const toFind = req.query.q as string;
    if(!toFind){
      throw new ApiError(400 ,  "Give the type you want");
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const errors = await ErrorLog.find({
      resolved: toFind,
    })
      .skip(skip)
      .limit(limit);

    const totalErrors = await ErrorLog.countDocuments({ resolved: toFind });

    const totalPages = Math.ceil(totalErrors / limit);

    res.status(200).json({
      data: errors,
      currentPage: page,
      totalPages: totalPages,
      totalErrors: totalErrors,
    });
  }

  private static async resolveError(
    req: Request,
    res: Response
  ): Promise<void> {
    const errorId = req.params.id;

    const updatedError = await ErrorLog.findByIdAndUpdate(errorId, {
      resolved: true,
    });

    if (!updatedError) {
      throw new ApiError(401, "Unable to update");
    }

    res
      .status(200)
      .json({ message: "Error resolved successfully", data: updatedError });
  }

  static updateError = Middleware.wrap(this.resolveError);
  static registerError = Middleware.wrap(this.createError);
  static getErrorByResolved = Middleware.wrap(this.findError);
}

export { Controller };
