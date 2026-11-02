
const path = require("path");
const { Pool } = require("pg");

// Always load the environment file from the ShopSphere backend folder
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
  override: true,
});

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "shopsphere",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
});

pool.on("connect", () => {
  console.log("ShopSphere PostgreSQL connected successfully.");
});

pool.on("error", (error) => {
  console.error("PostgreSQL error:", error.message);
});

module.exports = pool;
