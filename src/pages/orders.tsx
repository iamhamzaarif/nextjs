import {collection, doc, getDocs, orderBy, query} from "firebase/firestore";
import moment from "moment";
import {GetServerSidePropsContext} from "next";
import {getSession, useSession} from "next-auth/react";
import db from "../../firebase";
import {IOrder, ISession} from "../../typings";
import Order from "../components/Order";
import {Layout} from "../layout";
import {useRouter} from "next/router";

type Props = {
    orders: IOrder[];
};

const Orders = ({orders}: Props) => {
    const {data: session} = useSession();
    const router = useRouter();

    return (
        <Layout>
            <main className="max-w-screen-l max-auto p-10">
                <h1 className="text-3xl border-b mb-2 pb-1 border-[demo_yellow]">
                    Your Orders
                    <div
                        onClick={() => router.push("/shops")}
                        className="link float-right mb-0"
                    >
                        <p className="font-semibold m-auto text-blue-500 underline text-sm">Want to Visit us?</p>
                    </div>
                </h1>

                {session ? (
                    <h2>{orders?.length} Orders</h2>
                ) : (
                    <h2>Please sign in to see your orders</h2>
                )}

                <div className="mt-5 space-y-4">
                    {orders?.map((order) => (
                        <Order key={order.id} order={order}/>
                    ))}
                </div>

            </main>
        </Layout>

    );
};

export default Orders;

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    // Get user logged in credentials
    const session: any | ISession | null = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: `${process.env.NEXTAUTH_URL}/api/auth/signin`,
                permanent: false,
            },
            props: {}
        }
    }

    // // Firebase db
    const stripeOrdersQuery = query(
        collection(doc(collection(db, "users"), session.user.email), "orders"),
        orderBy("timestamp", "desc")
    );
    const stripeOrders = await getDocs(stripeOrdersQuery);

    // Stripe orders
    const orders = await Promise.all(
        stripeOrders.docs.map(async (order: any) => ({
            id: order.id,
            amount: order.data().amount,
            amount_shipping: order.data().amount_shipping,
            images: order.data().images,
            timestamp: moment(order.data().timestamp.toDate()).unix(),
            items: (
                await stripe.checkout.sessions.listLineItems(order.id, {
                    limit: 100,
                })
            ).data,
        }))
    );

    return {
        props: {
            orders,
        },
    };
};
