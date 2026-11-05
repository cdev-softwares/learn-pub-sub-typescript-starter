import amqp from "amqplib";
import { publishJSON } from "../internal/pubsub/publish.js"
import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";
import { testPlayState } from "../internal/gamelogic/gamestate.js"
import { getInput, printServerHelp } from "../internal/gamelogic/gamelogic.js";

async function main() {
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(rabbitConnString);
  const channel = await conn.createConfirmChannel();

  console.log("Successfully connected to RabbitMQ server !")
  console.log("Starting Peril server...");

  printServerHelp();

  process.on('SIGINT', () => {
    console.log("\nShutting down program ...")
    conn.close();
    process.exit(0);
  })

  let replLoopSwitch = true;
  while (replLoopSwitch) {
    const userWords = await getInput();
    if (userWords.length === 0) continue;
    switch (userWords[0]) {
      case "pause":
        console.log("Sending pause message ...");
        await publishJSON(channel, ExchangePerilDirect, PauseKey, testPlayState );
        break;
      case "resume":
        console.log("Sending resume message ...");
        testPlayState.isPaused = false;
        await publishJSON(channel, ExchangePerilDirect, PauseKey, testPlayState );
        break;
      case "quit":
        console.log("Exiting peril ...");
        replLoopSwitch = false;
        break;
      default:
        console.log("Unknown command ...");
        break;
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});


