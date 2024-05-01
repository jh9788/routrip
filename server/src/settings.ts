import "dotenv/config";
export const CORS_ORIGIN = "http://localhost:3000";
export const DB_USER = process.env.DB_USER as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const DB_DATABASE = process.env.DB_DATABASE as string;
export const DB_HOST = process.env.DB_HOST as string;
export const DB_PORT = Number(process.env.DB_PORT as string);
export const DB_LIMIT = Number(process.env.DB_LIMIT as string);
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRED_IN = process.env.JWT_EXPIRED_IN as string;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
export const JWT_REFRESH_EXPIRED_IN = process.env
  .JWT_REFRESH_EXPIRED_IN as string;
export const SALT_ROUND = Number(process.env.SALT_ROUND as string);