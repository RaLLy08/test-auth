import amqp from 'amqplib'

const queue = 'auth';

class RmqQueue {
    private channel: amqp.Channel | null = null;

    public async startAuthQueue() {
        const connection = await amqp.connect('amqp://guest:guest@rabbitmq')

        this.channel = await connection.createChannel()
        await this.channel.assertQueue(queue)

        return this.channel;
    }

    public rmqSend(str: string) {
        if (this.channel) {
            this.channel.sendToQueue(queue, Buffer.from(str))
        } else {
            console.log('Channel not ready')
        }
    }

    public rmqConsume(cb: (msg: amqp.ConsumeMessage | null) => void) {
        if (this.channel) {
            this.channel.consume(queue, msg => {
                cb(msg)
            })
        } else {
            console.log('Channel not ready')
        }
    }
}



export default new RmqQueue();