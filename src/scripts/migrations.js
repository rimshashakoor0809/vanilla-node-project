import { readFileSync } from 'fs';
import path from 'path';
import client from '../config/database';


const __dirname = import.meta.dirname;
const sqlFile = readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');


const runMigration = async () => {

  await client.connect();
  try {
    await client.query(sqlFile);
    console.log("Database schema migrated successfully.");
  } catch (error) {
    console.log("Error running migrations: ", error)
  }
  finally {
    client.end()
  }
}

runMigration()
