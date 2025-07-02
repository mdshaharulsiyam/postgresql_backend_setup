import { Pool } from 'pg';
import config from '../config/config';

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});
export default pool;