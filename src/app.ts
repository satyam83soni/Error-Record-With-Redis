import express from "express";
import dotenv from "dotenv";
import Database from "./utils/features";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import errorRouter from "./routes/error";
const app = express();
import EmailProcessor from "./redis/emailer";

dotenv.config({
  path: ".env",
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mayank-web-dev.s3.ap-south-1.amazonaws.com/index.html",
      "*",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
EmailProcessor.runWorker();
app.use(express.json());

Database.connecTOtDB();

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
      "Too many requests from this IP, please try again later after 15 mins.",
  })
);
app.use("/error", errorRouter);
app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
