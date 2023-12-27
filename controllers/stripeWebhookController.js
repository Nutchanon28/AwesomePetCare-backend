const User = require("../model/User");
const Ticket = require("../model/Ticket");
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
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // console.log(event);

    const dataObject = event.data.object;
    if (event.type === "charge.succeeded") {
        try {
            const customer = await stripe.customers.retrieve(
                dataObject.customer
            );
            // console.log(customer);
            const { username, petsId, service, time, price } =
                customer.metadata;
            // const pets = metadata.
            console.log(customer.metadata)

            const foundUser = await User.findOne({ username }).exec();

            const result = await Ticket.create({
                userId: foundUser._id,
                petsId: JSON.parse(petsId),
                service,
                datetime: time,
                price: parseInt(price),
                status: "booked", // booked, canceled, done
            });
            console.log("The Ticket was created.");
            console.log(result);
        } catch (err) {
            console.log("error at webhook");
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
    }

    res.json({ received: true });
};

module.exports = { webhook };
