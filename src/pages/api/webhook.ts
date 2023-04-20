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
const app = !admin?.apps?.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

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

export default async (req : NextApiRequest, res : NextApiResponse) => {
    const { method } = req;

    if (method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const requestBuffer = await buffer(req);
        const payload = requestBuffer.toString();
        const sig = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            await fulfillOrder(session);
            return res.status(200).send({ message: 'Order fulfilled successfully' });
        }
    } catch (err : any) {
        console.error('Error processing webhook:', err);
        return res.status(400).send({ message: 'Webhook error', error: err.message });
    }
};
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
