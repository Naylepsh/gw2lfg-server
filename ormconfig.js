// config for TypeORM
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env.dev" });

module.exports = {
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [path.join(__dirname, "./dist/data/entities/**/*.js")],
  migrations: [path.join(__dirname, "./dist/data/migrations/*")],
  cli: {
    migrationsDir: "./src/data/migrations",
  },
};
