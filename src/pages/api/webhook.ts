import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";

// Secure a connection to Firebase from backend
const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/gm, "\n")
    : undefined,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
} as ServiceAccount;

console.log("application App", !admin?.apps?.length)
const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })


// Establish connection to Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
const fulfillOrder = async (session: any) => {
  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`SUCCESS: Order ${session.id} has been added to the DB`);
    });
};

export default async (req, res) => {
    if (req.method === "POST") {
        const buf = await buffer(req);
        const sig = req.headers["stripe-signature"];

        let event;

        try {
            event = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
        } catch (err) {
            console.error(err);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Handle the event
        switch (event.type) {
            case "payment_intent.succeeded":
                const session = event.data.object;

                await fulfillOrder(session);
                return res.status(200).send({ message: 'Order fulfilled successfully' });
                break;
            // Handle other event types
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });
    }
};
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
