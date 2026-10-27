import amqp from "amqplib";
import { publishJSON } from "../internal/pubsub/publish.js"
import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";
import { testPlayState } from "../internal/gamelogic/gamestate.js"

async function main() {
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(rabbitConnString);
  const channel = await conn.createConfirmChannel();

  console.log("Successfully connected to RabbitMQ server !")
  console.log("Starting Peril server...");

  await publishJSON(channel, ExchangePerilDirect, PauseKey, testPlayState )

  process.on('SIGINT', () => {
    console.log("\nShutting down program ...")
    conn.close();
    process.exit(0);
  })
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});


