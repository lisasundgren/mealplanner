import * as dotenv from 'dotenv';
import { Client } from 'pg';

// reads the .env-file
dotenv.config();

// creates the database-client
const client = new Client({
  connectionString: process.env.PGURI,
});

// connects to the database
client
  .connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection failed:', err));

export default client;
