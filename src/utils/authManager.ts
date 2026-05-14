import jwt, {
    JwtPayload,
    Secret
} from "jsonwebtoken";

import {
    Request,
    Response,
    NextFunction
} from "express";

const secret: Secret =
    "asdfghjkledcrfvtghn";

interface UserPayload extends JwtPayload {
    email: string;
    role: string;
    investor_id: number;
}

interface AuthRequest extends Request {
    user?: UserPayload;
}

const signJwt = (
    payload: UserPayload
): string | undefined => {

    try {

        const token = jwt.sign(
            payload,
            secret,
            {
                expiresIn: "30m"
            }
        );

        return token;

    } catch (error) {

        console.log(error);

    }
};

const verifyInvestor = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Response | void => {

    try {

        const authHeader =
            req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                error: "Token Required"
            });

        }

        const token =
            authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            secret
        ) as UserPayload;

        if (decoded.role !== "investor") {

            return res.status(403).json({
                error: "Access Denied"
            });

        }

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            error: "Invalid Token"
        });

    }
};

export {
    signJwt,
    verifyInvestor
};