/* Database/database.js
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import User from '../Model/user';

const adapter = new SQLiteAdapter({
  schema: User, // Az itt megadott schema modellek közül választható
});

const database = new Database({
  adapter,
  modelClasses: [User], // Az összes modellel
  actionsEnabled: true,
});

export default database;
*/