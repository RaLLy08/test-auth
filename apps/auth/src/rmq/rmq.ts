import amqp from 'amqplib'

import startAuthQueue from './auth-queue'

const connectQueue = async () => {
    const connection = await amqp.connect('amqp://guest:guest@rabbitmq')
    console.log('Connected to RabbitMQ')
    return startAuthQueue(connection)
}

export default connectQueue