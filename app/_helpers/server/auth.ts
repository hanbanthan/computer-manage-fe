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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'object' && decoded !== null && 'role' in decoded) {
        return (decoded as jwt.JwtPayload).role;
    }
    return undefined;
}

async function hasRole(allowedRoles: string[]) {
    const role = await getRole();
    return role !== null && allowedRoles.includes(role);
}