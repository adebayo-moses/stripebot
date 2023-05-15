## Stripe Bot

adio fellas, this is a simple standalone script to get events from your stripe webook and post them to your microsoft teams app using a connector

no think am too much, this code is buggy (not fully tested)

Proceed with caution.
love and bugs.

## demopayload

here's the mock payload i use incase you do not have an existing webhook to get payload from

`curl -X POST -H "Content-Type: application/json" -d '
{
"id": "evt_1J6NkL2CwTaIn3nqQ1Sb",
"object": "event",
"api_version": "2021-08-23",
"created": 1634060325,
"data": {
"object": {
"id": "ch_1J6NjL2CwTaIn3nqLG9X41Jh",
"amount": 4999,
"created": 1634060322,
"currency": "usd",
"description": "Test payment",
"status": "succeeded"
}
},
"livemode": false,
"pending_webhooks": 1,
"request": {
"id": null,
"idempotency_key": null
},
"type": "charge.succeeded"
}
' http://localhost:8080/webhooks/stripe`
