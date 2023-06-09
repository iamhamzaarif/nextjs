import {CheckCircleIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/router";
import {Layout} from "../layout";

type Props = {};

const success = (props: Props) => {
    const router = useRouter();
    return (
        <Layout>
            <main className="max-screen-lg mx-auto">
                <div className="flex flex-col p-10 bg-white">
                    <div className="flex items-center space-x-2 mb-5">
                        <CheckCircleIcon className="text-green-500 h-10"/>
                        <h1 className="text-3xl">
                            Thank you, your order has been confirmed!
                        </h1>
                    </div>
                    <p>
                        Thank you for shopping with us. We'll send a confirmation once your item has shipped, if you
                        would like to check the status of your order(s) please press the link below.
                    </p>
                    <button onClick={() => router.push("/orders")} className="button text-black font-semibold mt-8">Go
                        to my orders
                    </button>
                </div>
            </main>
        </Layout>
    );
};

export default success;
