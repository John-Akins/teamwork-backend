/* eslint-disable linebreak-style */
import { validationResult } from 'express-validator';
import responseUtility from './responseUtility';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  return (!errors.isEmpty()) ? responseUtility.error(res, 422, errors.array()) : next();
};

export default validateRequest;
