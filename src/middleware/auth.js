import jwt from 'jsonwebtoken';
import responseUtility from '../utilities/responseUtility';

const auth = {};
const tokenSecret = '$hdsJmzjQ7,E.m2y$12$1iTvLIHS60iMROUjADnu8tdiUguselTrWjDo6SxVf';

auth.allUsers = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userIdMatch = req.headers.authorization.split(' ')[3];
    const decodedToken = jwt.verify(token, tokenSecret);
    const { userId } = decodedToken;
    console.log("userId :::::::::",userId,"userIdMatch :::::::::",userIdMatch)

    try {
      if (userId !== userIdMatch) {
        throw new Error('Invalid user ID'+userIdMatch);
      } else {
        next();
      }
    } catch (e) {
      return responseUtility.error(res, 401, e.message);
    }
  } catch (e) {
    return responseUtility.error(res, 401, 'Unauthorized request'+e);
  }
  return false;
};

auth.adminOnly = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userIdMatch = req.headers.authorization.split(' ')[3];
    console.log('userIdMatch :::::::::',userIdMatch)
    const decodedToken = jwt.verify(token, tokenSecret);
    const { userId, isAdmin } = decodedToken;

    try {
      if (userId !== userIdMatch) {
        throw new Error('Invalid user ID');
      }
      if (isAdmin !== true) {
        throw new Error('Elevated access rights required');
      } else {
        next();
      }
    } catch (e) {
      return responseUtility.error(res, 401, e.message);
    }
  } catch (e) {
    return responseUtility.error(res, 401, 'Unauthorized request');
  }
  return false;
};

auth.userIdMatchesAuthorId = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, tokenSecret);
    const { userId } = decodedToken;

    try {
      if (userId && parseInt(userId, 10) !== parseInt(req.body.authorId, 10)) {
        throw new Error('Only admin or account owner can edit/delete this feed, want to flag as inappropriate?');
      } else {
        next();
      }
    } catch (e) {
      return responseUtility.error(res, 401, e.message);
    }
  } catch (e) {
    return responseUtility.error(res, 401, 'Unauthorized request');
  }
  return false;
};

export default auth;
