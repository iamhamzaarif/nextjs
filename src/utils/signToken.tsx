import jwt from 'jsonwebtoken';

const SignToken = async (email: any) => {
    return jwt.sign({id: email}, process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string, {expiresIn: '1d'})
}

export default SignToken;