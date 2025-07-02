import bcrypt from 'bcrypt';
import pool from '../../db/connectDB';
const createUser = async ({ name, email, password, image }: any) => {
  const query = `
    INSERT INTO auth_users (name, email, password, image)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, image;
  `;
  const values = [name, email, password, image];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findUserByEmail = async (email: string) => {
  const query = `SELECT * FROM auth_users WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

const registerUser = async ({ name, email, password, image }: any) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return createUser({ name, email, password: hashedPassword, image });
};

const validateUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
};
export default Object.freeze({
  registerUser,
  validateUser,
});