// import { env } from "@/app/_helpers/config";
// import apiHandler from "@/app/_helpers/server/api/api-handler";
// import Joi from "joi";



// export const POST = apiHandler(register);

// async function register(req: Request) {
//     try {
//         const body = await req.json();

//         const backendRes = await fetch(`${env.be.url}/api/auth/register`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(body),
//         });

//         if (!backendRes.ok) {
//             const error = await backendRes.text();
//             console.error("❌ Backend /auth/register failed:", backendRes.status, errorText);
//             return new Response(error, { status: backendRes.status });
//         }

//         return new Response(null, { status: 201 });
//     } catch (error) {
//         console.error("❌ register() failed: ", error);
//         return new Response("Interal Server Error", { status: 500 });
//     }
// }

// register.schema = Joi.object({
//     username: Joi.string().required(),
//     password: Joi.string().required()
// });