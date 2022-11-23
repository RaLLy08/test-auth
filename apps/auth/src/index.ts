import express from "express";
import amqp from 'amqplib'
import router from "./router";
import bodyParser from "body-parser";
const cookieParser = require("cookie-parser");

if (process.platform === "win32") {
    require("dotenv/config")
}

const app = express();
const queue = 'auth';

app.use(bodyParser.json())
app.use(cookieParser())
app.use("/api/", router());


const bootstrap = async () => {
    const connection = await amqp.connect('amqp://guest:guest@rabbitmq')
    console.log('Connected to RabbitMQ')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue)

    app.listen(process.env.SERVER_PORT, () =>  console.log(`Server is listening on ${process.env.SERVER_PORT}`));
}

bootstrap()





