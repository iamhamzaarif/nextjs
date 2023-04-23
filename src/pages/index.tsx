import {GetServerSidePropsContext} from "next";
import {getSession, useSession} from "next-auth/react";
import Head from "next/head";
import {IProduct, ISession} from "../../typings";
import ProductFeed from "../components/ProductFeed";
import {Layout} from "../layout";

type Props = {
    products: IProduct[];
};

const Home = ({products}: Props) => {
    const {data: session} = useSession();

    return (
        <div>
            <Layout>
                <main className="max-w-screen-2xl mx-auto ">
                    {/* ProductFeed */}
                    <ProductFeed products={products}/>
                </main>
            </Layout>
        </div>
    );
};

export default Home;

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const products = await fetch("https://fakestoreapi.com/products").then(
        (res) => res.json()
    );

    // Get user logged in credentials
    const session: any | ISession | null = await getSession(context);
    if (!session) {
        return {
            props: {
                products,
            },
        };
    }


    return {
        props: {
            products,
            session,
        },
    };
};
