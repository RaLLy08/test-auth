import express from "express";
import router from "./router";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json())
app.use("/api/", router());

app.listen(process.env.SERVER_PORT, () =>  console.log(`Server is listening on ${process.env.SERVER_PORT}`));


