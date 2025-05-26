import { headers } from "next/headers"
import jwt from "jsonwebtoken";

export const auth = {
    isAuthenticated,
    verifyToken
}

async function verifyToken() {
    const authHeader = (await headers()).get('authorization');

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Authorization header missing or invalid");
    }

    const token = authHeader?.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (!decoded.sub) {
            throw new Error("Invalid token: missing subject");
        }

        return decoded.sub;
    } catch (error) {
        throw new Error("Invalid or expired token");
    } 
}

function isAuthenticated() {
    try {
        verifyToken();
        return true;
    } catch {
        return false;
    }
}