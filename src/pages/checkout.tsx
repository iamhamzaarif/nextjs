import {loadStripe, Stripe} from "@stripe/stripe-js";
import axios from "axios";
import {useSession} from "next-auth/react";
import Currency from "react-currency-formatter";
import {useSelector} from "react-redux";
import CheckoutProduct from "../components/CheckoutProduct";
import {selectItems, selectTotal} from "../slices/basketSlice";
import {useRouter} from "next/router";
import {Layout} from "../layout";

let stripePromise: Promise<Stripe | null>;

type Props = {};

const Checkout = (props: Props) => {
    const items = useSelector(selectItems);
    const total = useSelector(selectTotal);
    const {data: session} = useSession();
    const router = useRouter();

    const createCheckoutSession = async () => {
        if (!stripePromise) {
            stripePromise = loadStripe(process.env.stripe_public_key!);
        }
        // Call the backend to create a checkout session
        const checkoutSession = await axios.post("/api/create-checkout-session", {
            items: items,
            email: session?.user.email,
        });
        const stripe = await stripePromise;
        // Redirect user/customer to Stripe Checkout
        const result = await stripe!.redirectToCheckout({
            sessionId: checkoutSession.data.id,
        });

        if (result.error) {
            alert(result.error.message);
        }
    };

    return (
        <Layout>
            <main className="lg:flex max-w-screen-2xl mx-auto">
                {/* left */}
                <div className="flex-grow m-5 shadow-sm">
                    <div className="flex flex-col p-5 space-y-10 bg-white">
                        <h1 className="text-3xl border-b pb-4">
                            {items.length === 0
                                ? "Your Cart is empty."
                                : "Shopping Cart"}
                        </h1>
                        {items.length === 0 &&
                            <button onClick={() => router.push("/")}
                                    className="button mt-8 text-black font-bold">Shop</button>
                        }
                        {items.map((item) => (
                            <CheckoutProduct key={item.id} product={item}/>
                        ))}
                    </div>
                </div>
                {/* Right */}
                {items.length > 0 &&
                    <div className="flex flex-col bg-white p-10 shadow-md">
                        <h2 className="whitespace-nowrap">
                            Subtotal ({items.length} items):
                            <span className="font-bold">
                  {" "}
                                <Currency quantity={total} currency="CAD"/>
                </span>
                        </h2>
                        <button
                            role="link"
                            onClick={createCheckoutSession}
                            disabled={!session}
                            className={`button mt-2 text-black font-bold ${
                                !session &&
                                "from-gray-500 to-gray-200 border-gray-200 cursor-not-allowed"
                            }`}
                        >
                            {!session ? "Sign in to checkout" : "Proceed to Checkout"}
                        </button>
                    </div>
                }
            </main>
        </Layout>

    );
};

export default Checkout;
