import {createServer} from "node:http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000");

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port, dir: process.env.NEXT_DIR || undefined });
const handler = app.getRequestHandler();

app.prepare().then(() => {

  // Create HTTP server
  const httpServer = createServer(handler);

  // Load the server
  httpServer
      .once("error", (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
      });
});