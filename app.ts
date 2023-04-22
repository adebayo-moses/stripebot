// import { version } from "os"

// typescript version
// const http = require("http");
// const https = require("https");

import http, { IncomingMessage, ServerResponse } from "http";
import https, { RequestOptions } from "https";

const webhookUrl = "http://"; // URL of Microsoft Teams webhook

http
  .createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "POST" && req.url === "/webhooks/stripe") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const payload = JSON.parse(body);
        const event = payload.type;
        let message;

        switch (event) {
          case "charge.succeeded":
            message = "A new charge has been successfully created!";
            break;
          case "charge.failed":
            message = "A charge attempt has failed!";
            break;
          case "customer.created":
            message = "A new customer account has been created!";
            break;
          case "customer.updated":
            message = "A customer account has been updated!";
            break;
          default:
            message = "An unknown event has occurred!";
        }

        if (message) {
          const messagePayload = {
            "@type": "MessageCard",
            "@context": "https://schema.org/extensions",
            themeColor: "0072c6",
            summary: "Stripe event notification",
            title: "Stripe event notification",
            sections: [
              {
                activityTitle: message,
                activitySubtitle: event,
                activityImage:
                  "https://stripe.com/img/documentation/checkout/marketplace.png",
              },
            ],
          };

          const options: RequestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          const httpsReq = https.request(webhookUrl, options, (httpsRes) => {
            console.log(`statusCode: ${httpsRes.statusCode}`);
            httpsRes.on("data", (d) => {
              process.stdout.write(d);
            });
          });

          try {
            httpsReq.write(JSON.stringify(messagePayload));
            httpsReq.end();
            console.log(
              "Notification message successfully sent to Microsoft Teams!"
            );
          } catch (error) {
            console.error(
              "Error sending notification message to Microsoft Teams:",
              error
            );
          }

          httpsReq.write(JSON.stringify(messagePayload));
          httpsReq.end();
        }
      });
      res.statusCode = 200;
      res.end();
    }
  })
  .listen(8080); // Replace with the appropriate port number which is not already occupied

// In the TypeScript version, i have added some type annotations to variables, functions, and parameters to ensure stronger type-checking by the typescript compiler.

// i also imported the `IncomingMessage` and `ServerResponse` types from the `http` module and the `RequestOptions` type from the `https` module to properly type the request and response objects and the request options.

// i also renamed one of the `req` variables to `httpsReq` to avoid name conflicts.
// use with caution!
