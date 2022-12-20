import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import express, { Express } from "express";
import fileupload from 'express-fileupload';

import router from "./routes";
import logger from "./utils/logger";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

/** MIDDLEWARES */

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(fileupload());
app.use("/api", router);
app.use(errorHandler);

app.listen(port, () => logger.info(`⚡️ server: is running at port: ${port}`));

export default app;