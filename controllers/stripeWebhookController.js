const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const webhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    // Verify webhook signature and extract the event.
    // See https://stripe.com/docs/webhooks#verify-events for more information.
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(
        "-----------------------------------------------------------------------"
    );
    console.log(event);

    const dataObject = event.data.object;
    if (event.type === "charge.succeeded") {
        const customer = await stripe.customers.retrieve(dataObject.customer);
        console.log(
            "----------------------customer is here--------------------------------"
        );
        console.log(customer);
    }

    res.json({ received: true });
};

module.exports = { webhook };
