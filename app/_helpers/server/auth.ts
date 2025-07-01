import { cookies } from "next/headers"
import jwt from "jsonwebtoken";

export const auth = {
    isAuthenticated,
    verifyToken,
    getRole,
    hasRole,
}

async function verifyToken() {
    const token = (await cookies()).get('authorization')?.value ?? '';
    console.log("Auth cookie token:", token);
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

async function getRole() {
    const token = (await cookies()).get('authorization')?.value ?? '';

    if (!token || token.split('.').length !== 3) {
        console.warn('Invalid or missing token in cookie');
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        console.log("Decoded token:", decoded); 
        if (typeof decoded === 'object' && decoded !== null && 'role' in decoded) {
            return (decoded as jwt.JwtPayload).role;
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.warn('Token expired:', error.expiredAt);
            return null;
        }

        // For other JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
            console.warn('JWT error:', error.message);
            return null;
        }

        throw error;
    }
}

async function hasRole(allowedRoles: string[]) {
    const role = await getRole();
    return role !== null && allowedRoles.includes(role);
}