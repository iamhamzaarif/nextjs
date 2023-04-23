import {ReactNode} from "react";
import Header from "../components/Header";
import Head from "next/head";

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({children}: LayoutProps) => {
    return (
        <div>
            <Head>
                <title>Nextjs Demo</title>
                <link rel="icon" href="/vercel.svg"/>
            </Head>
            <Header/>
            {children}
        </div>
    );
};