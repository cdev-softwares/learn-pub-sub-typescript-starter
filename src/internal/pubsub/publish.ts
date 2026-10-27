import type { ConfirmChannel } from "amqplib";

export async function publishJSON<T>(
    ch: ConfirmChannel,
    exchange: string,
    routingKey: string,
    value: T,
): Promise<void> {

    const serializedVal = Buffer.from(JSON.stringify(value));
    await ch.publish(exchange, routingKey, serializedVal);

}
