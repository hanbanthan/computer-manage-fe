import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default async function errorHandler(error: Error | string) {
    if (typeof (error) === 'string') {
        const is404 = error.toLowerCase().endsWith('not found');
        const status = is404 ? 404 : 400;
        return NextResponse.json({ message: error }, { status });
    }

    if (error.name === 'JsonWebTokenError') {
        (await cookies()).delete('authorization');
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
}