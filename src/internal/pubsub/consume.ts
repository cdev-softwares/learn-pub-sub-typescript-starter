import amqp from "amqplib";
import type { Channel } from "amqplib";

export enum SimpleQueueType {
  Durable,
  Transient,
}

export async function declareAndBind(
    conn: amqp.ChannelModel,
    exchange: string,
    queueName: string,
    key: string,
    queueType: SimpleQueueType,
): Promise<[Channel, amqp.Replies.AssertQueue]> {
    const newChannel = await conn.createChannel();
    const durable = queueType === 0 ? true : false;
    const autoDelete = queueType === 1 ? true : false;
    const exclusive = queueType === 1 ? true : false;

    const newQueue = await newChannel.assertQueue(queueName, 
        {
        exclusive: exclusive,
        durable: durable, 
        autoDelete: autoDelete, 
    })
    await newChannel.bindQueue(newQueue.queue, exchange, key);
    return [newChannel, newQueue];
}
