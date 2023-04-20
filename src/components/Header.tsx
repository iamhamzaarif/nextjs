import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";

type Props = {};

const Header = (props: Props) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  const items = useSelector(selectItems);

  return (
    <header>
      {/* top nav */}
      <div className="flex items-center bg-fast_blue p-1 flex-grow py-2">
        <div className="h-12 flex items-center flex-grow sm:flex-grow-0">
          <Image
            onClick={() => router.push("/")}
            className="cursor-pointer overflow-hidden mt-2"
            src="/next.svg"
            width={145}
            height={40}
            alt="Fast marketplace"
          />
        </div>
        <div className="hidden sm:flex items-center h-10 rounded-md flex-grow"/>
        {/* right menu */}
        <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
          <div
            onClick={!session ? () => signIn() : () => signOut()}
            className="link"
          >
            <p className="font-extrabold md:text-sm">{session ? `Hello, ${session.user.name}` : "Sign In"}</p>
          </div>
          <div
            onClick={() => router.push("/checkout")}
            className="relative link flex items-center"
          >
            <span className="absolute top-0 -right-2 md:right-10 w-4 h-4 bg-[#01C4CC] text-center rounded-full text-black font-bold">
              {items.length}
            </span>

            <ShoppingCartIcon className="h-10" />
            <p className="hidden md:inline font-extrabold text-sm mt-2">
              Cart
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
