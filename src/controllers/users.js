/* eslint-disable linebreak-style */
import responseUtility from '../utilities/responseUtility';
import cloudinary from '../config/cloudinary';
import db from '../db';
import parseImageToStream from '../utilities/parseImageToStream';
import authController from './auth';

const usersController = {};
const { uploader } = cloudinary;

usersController.getAllUsers = (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query)
    .then((response) => {
      responseUtility.success(res, response.rows);
    })
    .catch(() => responseUtility.error(res, 400, 'someting went wrong while processing your request'));
};

usersController.deleteUser = (req, res) => {
  const query = {
    text: 'DELETE FROM users WHERE "userId" = $1',
    values: [req.params.userId],
  };
  db.query(query)
    .then(() => {
      const data = { message: 'User account successfully deleted' };
      return responseUtility.success(res, data);
    })
    .catch((e) => {
      responseUtility.error(res, 400, 'someting went wrong while processing your request');
    });
};

usersController.editUser = async (req, res) => {
  let url = '';
  const query = {};
  const {
    firstName, lastName, email, address, gender, jobRole, department, isAdmin,
  } = req.body;

  try {
    const isDuplicate = await authController.emailExists(email);
    if (isDuplicate === true) {
      return responseUtility.error(res, 402, 'this email already exists');
    }
    if (!req.file) {
      query.obj = {
        text: 'UPDATE users SET "firstName"=$1, "lastName"=$2, "email"=$3, "address"=$4, "gender"=$5, "jobRole"=$6, "department"=$7, "isAdmin"=$8, "isNewAccount"=$9 WHERE "userId"=$10',
        values: [firstName, lastName, email, address, gender, jobRole, department, isAdmin, true, req.params.userId],
      };
    } else {
      const file = parseImageToStream(req);
      const image = await uploader.upload(file);
      url = image.url;
      query.obj = {
        text: 'UPDATE users SET "firstName"=$1, "lastName"=$2, "email"=$3, "address"=$4, "gender"=$5, "jobRole"=$6, "department"=$7, "isAdmin"=$8, "imageUrl"=$9, "isNewAccount"=$10 WHERE "userId"=$11',
        values: [firstName, lastName, email, address, gender, jobRole, department, isAdmin, url, true, req.params.userId],
      };
    }
    await db.query(query.obj);
    const data = { message: 'User account has been succesfully updated' };
    responseUtility.success(res, data);
  } catch (error) {
    responseUtility.error(res, 400, `someting went wrong while processing your request${error}`);
  }
};

export default usersController;
