import Joi from "joi";

import JwtTokenService from "../auth/jwt-token.service";

export const signupSchema = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .required().min(6),
});

export const signinSchema = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .required().min(6),
    deviceFingerprint: Joi.string().required()
});
