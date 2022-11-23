import { JwtAccessDecoded } from "./auth/jwt-token.service";

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        DB_USER: string
        DB_HOST: string
        DB_PORT: string
        DB_USER_PASSWORD: string
        DB_NAME: string
        JWT_SECRET: string
        JWT_ACCESS_TOKEN_EXPIRES_IN_SEC: string
      }
    }
    namespace Express {
      interface Request {
        accessDecoded: JwtAccessDecoded
      }
    }
}

export {}