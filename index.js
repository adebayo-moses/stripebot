const http = require("http");
const https = require("https");

const webhookUrl = "ah not so fast bro!"; //URL of Microsoft Teams webhook

const handleError = (error) => {
  console.error(error);
  // Display a message to the user
  const message = `Error sending notification message to Microsoft Teams: ${error.message}`;
  alert(message);
};

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
          case "invoice.created":
            message = "A new invoice has been created!";
            break;
          default:
            message = "An unknown event has occurred!";
            break;
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

          const req2 = https.request(webhookUrl, options, (res) => {
            console.log(`statusCode: ${res.statusCode}`);
            res.on("data", (d) => {
              process.stdout.write(d);
            });
          });

          req2.on("error", handleError);

          req2.write(JSON.stringify(messagePayload));
          req2.end();
        }
      });
      res.statusCode = 200;
      res.end();
    }
  })
  .listen(8080); // Replace with the appropriate port number which is not already occupied

console.log("Server listening on port 8080...");

// mock payload data
// curl -X POST -H "Content-Type: application/json" -d '{
//     "type": "charge.succeeded",
//     "data": {
//       "id": "ch_1234567890abcdefg",
//       "amount": 100,
//       "currency": "USD"
//     }
//   }' http://localhost:8080/webhooks/stripe

try {
  httpsReq.write(JSON.stringify(messagePayload));
  httpsReq.end();
  console.log("Notification message successfully sent to Microsoft Teams!");
} catch (error) {
  console.error(
    "Error sending notification message to Microsoft Teams:",
    error
  );
}
