import express from "express";
import morgan from "morgan";
import { Routers } from "./routers";
import { Utils } from "./utils";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(Utils.logRequestTime);

app.use("/users", Routers.User);

app.use(Utils.logErrors);
app.use(Utils.errorHandler);

export default app;
