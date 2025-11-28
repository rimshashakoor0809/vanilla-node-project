import { Client } from 'pg';

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
})



client.connect().then(() => {
  console.log('Connected to database successfully.')
}).catch(error => console.log("🧊 Error connecting to database"))

export default client;