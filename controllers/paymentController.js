const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const createPaymentSession = async (req, res) => {
    const { tier, pets, time } = req.body;
    const petPriceDatas = pets.map((pet) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: pet.name,
                },
                unit_amount: 20 * 100,
            },
            quantity: 1,
        };
    });
    const priceDatas = [
        {
            price_data: {
                currency: "usd",
                product_data: {
                    name: tier,
                },
                unit_amount: tier === "Basic" ? 25 * 100 : 40 * 100,
            },
            quantity: 1,
        },
        ...petPriceDatas,
    ];

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: priceDatas,
            success_url: `${process.env.CLIENT_URL}/`,
            cancel_url: `${process.env.CLIENT_URL}/profile`,
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = { createPaymentSession };
