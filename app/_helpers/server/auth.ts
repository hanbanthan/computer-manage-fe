import { cookies } from "next/headers"
import jwt from "jsonwebtoken";

export const auth = {
    isAuthenticated,
    verifyToken
}

async function verifyToken() {
    const token = (await cookies()).get('authorization')?.value ?? '';
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const id = decoded.sub as string;
    return id;
}

async function isAuthenticated() {
    try {
        await verifyToken();
        return true;
    } catch {
        return false;
    }
}