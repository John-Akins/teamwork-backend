/* eslint-disable linebreak-style */
import express from 'express';
import validator from '../middleware/input-validator';
import auth from '../middleware/auth';
import multer from '../middleware/multer-config';
import usersController from '../controllers/users';
import validateRequest from '../utilities/validateRequest';

const router = express.Router();

router.get('/', auth.adminOnly, usersController.getAllUsers);

router.delete('/:userId', auth.adminOnly, validator.deleteUser, validateRequest, usersController.deleteUser);

router.patch('/:userId', auth.adminOnly, multer.multerUploads, validator.createUser, validateRequest, usersController.editUser);

export default router;
