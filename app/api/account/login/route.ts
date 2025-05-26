// import apiHandler from "@/app/_helpers/server/api/api-handler";
// import { env } from "@/app/_helpers/config";
// import { cookies } from "next/headers";
// import Joi from "joi";

// export const POST = apiHandler(login);

// async function login (req: Request) {
//     const body = await req.json();

//     const backendRes = await fetch(`${env.be.url}/api/auth/login`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//     });

//     if (!backendRes.ok) {
//         const error = await backendRes.text();
//         return new Response(error, { status: backendRes.status });
//     }

//     const { user, token } = await backendRes.json();

//     (await cookies()).set('authorization', token, { httpOnly: true });

//     return Response.json(user);
// }
// login.schema = Joi.object({
//     username: Joi.string().required(),
//     password: Joi.string().required()
// }); 