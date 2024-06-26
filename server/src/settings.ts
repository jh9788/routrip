import "dotenv/config";
export const CORS_ORIGIN = process.env.CORS_ORIGIN as string;
export const DB_USER = process.env.DB_USER as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const DB_DATABASE = process.env.DB_DATABASE as string;
export const DB_HOST = process.env.DB_HOST as string;
export const DB_PORT = Number(process.env.DB_PORT as string);
export const DB_LIMIT = Number(process.env.DB_LIMIT as string);
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
export const JWT_ACCESS_EXPIRED_IN = process.env.JWT_ACCESS_EXPIRED_IN as string;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
export const JWT_REFRESH_EXPIRED_IN = process.env.JWT_REFRESH_EXPIRED_IN as string;
export const SALT_ROUND = Number(process.env.SALT_ROUND as string);
export const ACCESS_KEY = process.env.ACCESS_KEY as string;
export const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY as string;
export const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION as string;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
export const LIMIT = 12;
