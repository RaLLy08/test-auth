import type { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from "express";


const validateRequestMiddleware = (schema: ObjectSchema<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      const options = {
        abortEarly: false,
      }
      const { error } = schema.validate(req.body, options); 

      if (error) { 
        const { details } = error; 

        const message = { 
          message: 'Validation error', 
          errors: details 
        }

        return res.status(422).json(message) 
      } 

      next();
    };

export default validateRequestMiddleware;
