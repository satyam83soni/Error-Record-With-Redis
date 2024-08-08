import express from "express";
import { Controller } from "../controller/error";
const router = express.Router();

router
  .post("/createError", Controller.registerError)
  .get("/getErrors", Controller.getErrorByResolved)
  .patch("/:id", Controller.updateError);

export default router;
