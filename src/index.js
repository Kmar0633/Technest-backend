import express from "express";
import cors from "cors";
import error from "http-errors";
import config from "../config/config.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  }));
app.use(cookieParser());

app.get("/technest-backend", async (req, res) => {
  res.send({
    status: "success",
    message: "Fast Express OK",
  });
});

app.use("/technest-backend/v1", routes.v1);


app.use((req, res, next) => {
  next(error.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(config.port, config.host, () =>
  console.log(`Server started on ${config.host}:${config.port}`)
);