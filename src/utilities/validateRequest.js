/* eslint-disable linebreak-style */
import { validationResult } from 'express-validator';
import responseUtility from './responseUtility';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responseUtility.error(res, 422, errors.array());
  }
  return next();
};

export default validateRequest;
