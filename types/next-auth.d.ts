import {DefaultSession} from "next-auth"

declare module "next-auth" {
    interface Session {
        loggedUser: string,
        user: {
            address: string
        } & DefaultSession["user"]
    }
}
