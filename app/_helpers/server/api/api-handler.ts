import { NextRequest, NextResponse } from 'next/server';
import jwtMiddleware from './jwt-middleware';
import validateMiddleware from './validate-middleware';
import errorHandler from './error-handler';

export default function apiHandler(
  handler: any
) {
	const wrappedHandler: any = {};
    const httpMethod = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

    httpMethod.forEach(method => {
        if (typeof handler[method] !== 'function') return;

        wrappedHandler[method] = async (req: NextRequest, ...args: any) => {
            try {
                const json = await req.json();
                req.json = () => json;
            } catch {}

            try {
                await jwtMiddleware(req);
                await validateMiddleware(req, handler[method].schema);

                const responseBody = await handler[method](req, ...args);
                return NextResponse.json(responseBody || {});
            } catch (error: any) {
                return errorHandler(error);
            }
        };
    });
    return wrappedHandler;
}