import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import responseUtility from '../utilities/responseUtility';
import cloudinary from '../config/cloudinary';
import db from '../db';
import parseImageToStream from '../utilities/parseImageToStream';

dotenv.config();

const authController = {};
const { uploader } = cloudinary;
const { tokenSecret } = process.env;

authController.signin = (req, res) => {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [req.body.email],
  };
  db.query(query)
    .then((user) => {
      if (user.rows[0] === undefined) {
        return responseUtility.error(res, 401, 'incorrect email or password');
      }

      bcrypt.compare(req.body.password, user.rows[0].password)
        .then((valid) => {
          if (!valid) {
            responseUtility.error(res, 401, 'incorrect email or password');
          }

          const token = jwt.sign({ userId: user.rows[0].userId, isAdmin: user.rows[0].isAdmin }, tokenSecret, { expiresIn: '24h' });
          const data = { token, userId: user.rows[0].userId, jobRole: user.rows[0].jobRole };

          responseUtility.success(res, data);
        })
        .catch(() => {
          responseUtility.error(res, 401, 'incorrect email or password');
        });
    })
    .catch(() => responseUtility.error(res, 400, 'someting went wrong while processing your request'));
};


const emailExists = (email) => new Promise((resolve, reject) => {
  const query = {
    // give the query a unique name
    name: 'fetch-user',
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  };
  db.query(query)
    .then((user) => {
      if (user.rows[0] !== undefined) {
        resolve(true);
      }
      resolve(false);
    })
    .catch(() => {
      reject(new Error({
        status: 'error',
        error: 'could not perform request',
      }));
    });
});

authController.createUser = async (req, res) => {
  if (!req.file) {
    return responseUtility.error(res, 401, 'Please select a gif file to upload');
  }
  const {
    firstName, lastName, email, address, password, gender, jobRole, department, isAdmin,
  } = req.body;

  try {
    const isDuplicate = await emailExists(email);
    if (isDuplicate === true) {
      return responseUtility.error(res, 402, 'this email already exists');
    }
    const file = parseImageToStream(req);
    const image = await uploader.upload(file);
    const userId = new Date().getTime();
    const hash = bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users("userId", "firstName", "lastName", "email", "address", "password", "gender", "jobRole", "department", "isAdmin", "imageUrl", "isNewAccount") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', values: [userId, firstName, lastName, email, address, hash, gender, jobRole, department, isAdmin, image.url, true],
    };
    await db.query(query);

    const data = { message: 'User account successfully created' };
    responseUtility.success(res, data);
  } catch (error) {
    responseUtility.error(res, 400, 'someting went wrong while processing your request');
  }
};


export default authController;
