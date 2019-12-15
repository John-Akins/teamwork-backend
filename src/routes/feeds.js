/* eslint-disable linebreak-style */
import express from 'express';
import inputValidator from '../middleware/input-validator';
import auth from '../middleware/auth';
import feedController from '../controllers/feeds';

const router = express.Router();

router.get('/', auth.allUsers, inputValidator.getFeeds, feedController.getFeeds);

export default router;
