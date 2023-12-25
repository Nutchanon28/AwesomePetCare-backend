const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const createPaymentSession = async (req, res) => {
    const username = req.username;
    const { service, tier, pets, time } = req.body;

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
        console.log(calculatePrice(priceDatas));
        const customer = await stripe.customers.create({
            metadata: {
                username,
                petsId: JSON.stringify(pets.map((pet) => pet._id)),
                service,
                time,
                price: calculatePrice(priceDatas),
            },
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer: customer.id,
            line_items: priceDatas,
            success_url: `${process.env.CLIENT_URL}/`,
            cancel_url: `${process.env.CLIENT_URL}/book_service/pet_grooming`,
        });
        // console.log(session);

        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const calculatePrice = (priceDatas) => {
    return priceDatas.reduce(
        (prev, current) =>
            prev + current.price_data.unit_amount * current.quantity,
        0
    );
};

module.exports = { createPaymentSession };
