import 'dotenv/config';
import express from "express";

import router from "./router";

const app = express();

app.use("/api/", router());

app.listen(process.env.PORT, () =>  console.log(`Server is listening on ${process.env.PORT}`));