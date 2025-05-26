import joi from 'joi';
export default async function validateMiddleware (req: Request, schema: joi.ObjectSchema) {
    if (!schema) return;

    const options = {
        abortEarly: false,
        allowUnknow: true,
        stripUnknow: true,
    }

    const body = await req.json();
    const { error, value } = schema.validate(body, options);

    if (error) {
        throw `Validation error: ${error.details.map(x => x.message).join(', ')}`;
    }

    //update the req.json to return sanitized req body
    req.json = () => value;
}