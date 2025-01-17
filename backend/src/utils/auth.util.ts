import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const hashPassword = async (password: string) : Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);``
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (payload: object, time = '1d'): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: time});
}; 

export const verifyToken =  (token : string) : any  => {
  try{
  return   jwt.verify(token, JWT_SECRET);
  }catch(error){
    throw new Error('Something wrong while verify token.')     
  } 
};
