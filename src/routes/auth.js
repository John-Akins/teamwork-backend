import express from 'express';
import validator from '../middleware/input-validator';
import auth from '../middleware/auth';
import multer from '../middleware/multer-config';
import authController from '../controllers/auth';
import validateRequest from '../utilities/validateRequest';

const router = express.Router();

router.post('/signin', validator.signin, authController.signin);

router.post('/create-user', auth.adminOnly, multer.multerUploads, validator.createUser, validateRequest, authController.createUser);

export default router;
