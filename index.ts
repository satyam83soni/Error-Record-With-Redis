import express from "express";
import dotenv from "dotenv"
import Error from "./src/middlewares/error"

const app = express();


dotenv.config({

    path: ".env"  
});

app.get("/", (req, res) => {
    res.send("Hello");
  });
  
  
  app.use(Error.getError);
  
  app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
  });






