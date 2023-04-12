import amqp from 'amqplib'


class RmqQueue {
    private channel: amqp.Channel | null = null;
    queue: string;

    constructor(queue: string) {
        this.queue = queue;
    }

    async startAuthQueue() {
        const host = process.env.RABBITMQ_HOST || 'localhost';

        const connection 
            = await amqp.connect(
                `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${host}`
            );

        this.channel = await connection.createChannel();
        await this.channel.assertQueue(this.queue);
        console.log('Queue started');

        return this.channel;
    }

    send(str: string, messageId: string) {
        const options = {
            messageId,
        }

        if (this.channel) {
            this.channel.sendToQueue(this.queue, Buffer.from(str), options);
        } else {
            console.log('Channel not ready');
        }
    }

    // consume(cb: (msg: amqp.ConsumeMessage | null) => void) {
    //     if (this.channel) {
    //         this.channel.consume(this.queue, msg => {
    //             cb(msg);
    //         })
    //     } else {
    //         console.log('Channel not ready');
    //     }
    // }

    ack(msg: amqp.Message) {
        if (this.channel) {
            this.channel.ack(msg);
        } else {
            console.log('Channel not ready');
        }
    }

    // get(cb: (msg: amqp.GetMessage | null) => void, id: string) {
    //     if (this.channel) {
    //         this.channel.get(this.queue, { noAck: true })
    //     } else {
    //         console.log('Channel not ready');
    //     }
    // }

    createPayload(payload: any) {
        return JSON.stringify(payload);
    }

}



export default new RmqQueue('auth');