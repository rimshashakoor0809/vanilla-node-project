import bcrypt from 'bcrypt';
import client from "../config/database.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/error.js";
import { hashedPassword } from "../utils/hashPassword.js";
import { generateToken } from '../utils/jwt.js';

export const register = catchAsync(async (req, res, next) => {

  const { firstName, lastName, email, password } = req.body || {};

  if (!firstName || !email || !password) {
    throw new AppError("Please provide all the required fields", 400)
  }

  // check if email already exists
  const findUserByIdQuery = 'SELECT * FROM users WHERE email = $1;'
  const existingUser = await client.query(findUserByIdQuery, [email]);
  console.log("Existing user: ", existingUser);
  if (existingUser?.rows?.length > 0) {
    throw new AppError(`This ${email} already exists`, 400);
    return;
  }

  // insert new user
  const registerUserQuery = `
  INSERT INTO 
  users (first_name, last_name, email, password)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
   `

  const hashed = await hashedPassword(password);
  console.log("Hashed Password: ", hashed);
  const result = await client.query(registerUserQuery, [firstName, lastName, email, hashed]);
  const newUser = result?.rows?.[0] || {};
  delete newUser.password;

  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(
    {
      success: true,
      message: 'User registered successfully.',
      user: newUser
    }))
})

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new AppError('Please provide email and password to login', 400);
  }

  const findUserByEmailQuery = `SELECT * FROM users WHERE email = $1`;
  const existingUser = await client.query(findUserByEmailQuery, [email]);

  if (!existingUser?.rows?.length) {
    throw new AppError(`User (${email}) not found. `, 400);
  }
  const user = existingUser?.rows?.[0] || {}
  const isPasswordMatched = await bcrypt.compare(password, user?.password);

  if (!isPasswordMatched) {
    throw new AppError('Invalid Credentials', 401)
  }

  // generate access token
  const payload = {
    id: user?.id,
    name: user?.firstName || user?.lastName || '',
    email: user?.email || '',
  }

  const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
  const accessToken = generateToken('access', payload, secret);

  // set cookies

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  })

  delete user.password;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(
    {
      success: true,
      message: 'User login successfully.',
      token: accessToken
    }))

})