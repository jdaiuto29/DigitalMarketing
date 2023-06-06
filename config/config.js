require("dotenv").config()
module.exports = {
  "development": {

    // live deploy config
    // username: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME,
    // host: process.env.DB_HOST,
    // port: 25060,
    // dialect: "postgres",
    // dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },

    "username": process.env.DB_USER || "postgres",
    "password": process.env.DB_PASS || "Giants115@",
    "database": "digital-marketing1",
    "host": process.env.DB_HOST || "localhost",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialectOptions": {"ssl": { "require": true, "rejectUnauthorized": false }}

  }
}