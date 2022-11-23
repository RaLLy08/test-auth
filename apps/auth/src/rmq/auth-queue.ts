import type amqp from 'amqplib'

const queue = 'auth';

let channel: amqp.Channel | null = null;

const startAuthQueue = async (connection: amqp.Connection) => {
    channel = await connection.createChannel()
    await channel.assertQueue(queue)

    return channel;
}

// export const rmqSend = (str: string) => {
//     if (channel) {
//         channel.sendToQueue(queue, Buffer.from(str))
//     } else {
//         console.log('Channel not ready')
//     }
// }


// export const rmqConsume = (cb: (msg: amqp.ConsumeMessage | null) => void) => {
//     if (channel) {
//         channel.consume(queue, msg => {
//             cb(msg)
//         }, { noAck: true })
//     } else {
//         console.log('Channel not ready')
//     }
// }


export default startAuthQueue;