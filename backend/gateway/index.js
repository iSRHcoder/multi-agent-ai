import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Gateway is running",
    status: "success",
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`gateway started at port - ${PORT}`);
});
