const http = require("http");

// Create an HTTP server to handle incoming requests
const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    console.log("Received webhook data:", body);
    // process the data received from Stripe according to your needs here
    res.end("Received webhook data");
  });
});

// Start the server on the specified port
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
