const postgres = require('pg');
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const pool = new postgres.Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
  });



module.exports = pool;