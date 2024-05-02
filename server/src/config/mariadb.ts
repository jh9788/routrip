import { createPool } from "mysql2/promise";
import { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE, DB_PORT, DB_LIMIT } from "../settings";

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  connectionLimit: DB_LIMIT,
  dateStrings: true,
});
