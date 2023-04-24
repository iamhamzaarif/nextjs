import jwt from 'jsonwebtoken';

const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

const authMiddleware = (handler: any) => async (req: any, res: any) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        req.user = jwt.verify(token, jwtSecret as string);
        return handler(req, res);
    } catch (error) {
        res.status(401).json({error: 'Unauthorized'});
    }
};

export default authMiddleware;
