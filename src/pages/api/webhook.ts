import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import Stripe from "stripe";

// Secure a connection to Firebase from backend
const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
            ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/gm, "\n")
            : undefined,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
} as ServiceAccount;

// Initialize Firebase app
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Establish connection to Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

// Function to fulfill an order
const fulfillOrder = async (paymentIntent: Stripe.PaymentIntent | any) => {
    const { metadata, id, amount_total, total_details } = paymentIntent;
    const { email, images } = metadata;

    const orderData = {
        amount: amount_total / 100,
        images: JSON.parse(images),
        amount_shipping: (total_details?.amount_shipping ?? 0) / 100,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
        await app
            .firestore()
            .collection("users")
            .doc(email)
            .collection("orders")
            .doc(id)
            .set(orderData);

        console.log(`SUCCESS: Order ${id} has been added to the DB`);
    } catch (err) {
        console.error("Error adding order to Firestore", err);
        throw new Error("Error adding order to Firestore");
    }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).end("Method Not Allowed");
    }

    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig : any = req.headers["stripe-signature"];

    let event: Stripe.Event;

    // Verify that the Event posted came from Stripe
    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err: any) {
        console.error("Error verifying Stripe signature", err);
        return res.status(400).end(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed":
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await fulfillOrder(paymentIntent);
                break;

            // Handle other event types
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.error("Error handling Stripe event", err);
        res.status(500).end("Internal Server Error");
    }
};

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};
