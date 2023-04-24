import NextAuth, {AuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import SignToken from "../../../utils/signToken";

const jwtSecret = process.env.SECRET;

const callbacks = {
    async jwt({token, user, account}: any) {
        if (account) {
            token.userToken = await SignToken(user?.email as string);
        }
        return token;
    },

    async session({session, token}: any) {
        session.loggedUser = token.userToken;
        return session;
    },
}

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    secret: jwtSecret,
    jwt: {
        secret: jwtSecret,
        signingKey: process.env.JWT_SIGNING_KEY,
        encryption: true,
    },
    callbacks,
} as AuthOptions);
