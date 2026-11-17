import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};
const dbName = process.env.DB_NAME || "food_del";

// pool-i perdoret nga te gjitha modelet per te ekzekutuar query
const pool = mysql.createPool({
  ...dbConfig,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true, // DECIMAL kthehet si numer (p.sh. 12.5) e jo si tekst
});

export async function connectDB() {
  // krijojme databazen nese nuk ekziston
  const connection = await mysql.createConnection({ ...dbConfig, multipleStatements: true });
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);

    // krijojme tabelat nga database/schema.sql
    const schemaPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../database/schema.sql");
    const schema = await readFile(schemaPath, "utf8");
    await connection.query(schema);
  } finally {
    await connection.end();
  }
  console.log(`Connected to MySQL database "${dbName}"`);
}

export default pool;
