import {ShoppingCartIcon} from "@heroicons/react/24/outline";
import {signIn, signOut, useSession} from "next-auth/react";
import Image from "next/image";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {selectItems} from "../slices/basketSlice";

type Props = {};

const Header = (props: Props) => {
    const {data: session} = useSession();
    const router = useRouter();
    const items = useSelector(selectItems);

    return (
        <header>
            {/* top nav */}
            <div className="flex items-center bg-demo_yellow p-1 flex-grow py-2">
                <div className="h-12 flex items-center flex-grow sm:flex-grow-0">
                    <Image
                        onClick={() => router.push("/")}
                        className="cursor-pointer overflow-hidden mt-2"
                        src="/next.svg"
                        width={145}
                        height={40}
                        alt="Nextjs Demo"
                    />
                </div>
                <div className="hidden sm:flex items-center h-10 rounded-md flex-grow"/>
                {/* right menu */}
                <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
                    <div
                        onClick={!session ? () => signIn() : () => signOut()}
                        className="link"
                    >
                        <p className="font-extrabold text-black md:text-sm">{session ? `Hello, ${session.user.name}` : "Sign In"}</p>
                    </div>
                    {session && <div
                        onClick={() => router.push("/orders")}
                        className="link"
                    >
                        <p className="font-extrabold text-black md:text-sm">Orders</p>
                    </div>}
                    <div
                        onClick={() => router.push("/checkout")}
                        className="relative link flex items-center"
                    >
            <span
                className="absolute top-0 -right-2 md:right-10 w-4 h-4 bg-[#000000] text-black text-center rounded-full text-white font-bold">
              {items.length}
            </span>

                        <ShoppingCartIcon className="h-10 text-black"/>
                        <p className="hidden md:inline font-extrabold text-black text-sm mt-2">
                            Cart
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
