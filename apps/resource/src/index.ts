import express from "express";
import bodyParser from "body-parser";
const cookieParser = require("cookie-parser");
import morgan from "morgan";

import router from "./router";
import rmq from "./rmq";

if (process.platform === "win32") {
    require("dotenv/config")
}

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/", router());

const bootstrap = async () => {
    await rmq.startAuthQueue();

    app.listen(7071, () =>  console.log(`Server is listening on ${7071}`));
}

bootstrap()
