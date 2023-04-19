const http = require("http");
const https = require("https");

const webhookUrl = "http://"; //URL of Microsoft Teams webhook

http
  .createServer((req, res) => {
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

          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          const req = https.request(webhookUrl, options, (res) => {
            console.log(`statusCode: ${res.statusCode}`);
            res.on("data", (d) => {
              process.stdout.write(d);
            });
          });

          req.on("error", (error) => {
            console.error(error);
          });

          req.write(JSON.stringify(messagePayload));
          req.end();
        }
      });
      res.statusCode = 200;
      res.end();
    }
  })
  .listen(8080); // Replace with the appropriate port number which is not already occupied
