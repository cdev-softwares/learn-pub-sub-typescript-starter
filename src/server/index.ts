import amqp from "amqplib";

async function main() {
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(rabbitConnString);
  console.log("Successfully connected to RabbitMQ server !")
  console.log("Starting Peril server...");

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


