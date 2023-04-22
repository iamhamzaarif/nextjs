import { NextApiRequest, NextApiResponse } from "next";
import { IProduct } from "@/typings";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("No Stripe secret key provided");
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function checkoutHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
  try {
    const { items, email } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Invalid items provided");
    }

    const transformedItems = items.map((item: IProduct) => ({
      price_data: {
        currency: "usd",
        unit_amount: item.price * 100,
        product_data: {
          name: item.title,
          description: item.description,
          images: [item.image],
        },
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["CA", "US", "GB", "PK"],
      },
      line_items: transformedItems,
      mode: "payment",
      success_url: `${process.env.HOST}/success`,
      cancel_url: `${process.env.HOST}/`,
      metadata: {
        email,
        images: JSON.stringify(
            items.map((item: IProduct) => item?.image)
        ),
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
