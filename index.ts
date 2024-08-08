import express from "express";
import dotenv from "dotenv";
import Error from "./src/middlewares/error";
import Database from "./src/utils/features";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import errorRouter from "./src/routes/error"
const app = express();

dotenv.config({
  path: ".env",
});

app.use(
  cors({
    origin: ["http://localhost:5173", "*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());



Database.connecTOtDB(process.env.MONGO_URL);




app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
      "Too many requests from this IP, please try again later after 15 mins.",
  })
);


app.get("/", (req, res) => {
  res.send("Hello");
});


app.use("api/v1/error" , errorRouter);


app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
