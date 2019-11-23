import {
 param, sanitizeParam, body, sanitizeBody,
} from 'express-validator';

const inputValidator = {};

inputValidator.signin = [
  body('email', 'please enter a valid email').not().isEmpty().isEmail(),
  sanitizeBody('email').trim().escape(),
  sanitizeBody('password').trim().escape(),
];

inputValidator.createUser = [
  body('firstName').not().isEmpty().isLength({ min: 2 }),
  body('lastName').not().isEmpty().isLength({ min: 2 }),
  body('email').not().isEmpty().isEmail()
    .isLength({ min: 8 }),
  body('address').not().isEmpty().isLength({ min: 10 }),
  body('gender').not().isEmpty().isLength({ min: 4 }),
  body('jobRole').not().isEmpty().isLength({ min: 2 }), 
  body('department').not().isEmpty().isLength({ min: 2 }),
  body('password').not().isEmpty().isLength({ min: 8 }),
  body('isAdmin').not().isEmpty().isBoolean(),

  sanitizeBody('firstName').trim().escape(),
  sanitizeBody('lastName').trim().escape(),
  sanitizeBody('email').trim().escape(),
  sanitizeBody('address').trim().escape(),
  sanitizeBody('gender').trim().escape(),
  sanitizeBody('jobRole').trim().escape(),
  sanitizeBody('department').trim().escape(),
  sanitizeBody('password').trim().escape(),
  sanitizeBody('isAdmin').toBoolean(),
];

inputValidator.createArticle = [
  body('title').not().isEmpty().isLength({ max: 100 }),
  body('article').not().isEmpty().isLength({ max: 1000 }),

  sanitizeBody('userId').trim().escape(),
  sanitizeBody('article').trim().escape(),
  sanitizeBody('title').trim().escape(),
  sanitizeBody('isAdmin').toBoolean(),
];

inputValidator.createGif = [
  body('title').not().isEmpty().isLength({ max: 100 }),

  sanitizeBody('userId').trim().escape(),
  sanitizeBody('title').trim().escape(),
];

inputValidator.deleteGif = [
  param('gifId').not().isEmpty().isLength({max: 100}),

  sanitizeParam('gifId').trim().escape(),
  sanitizeBody('authorId').trim().escape(),
  sanitizeBody('userId').trim().escape(),
];

inputValidator.commentArticle = [
  body('comment').not().isEmpty().isLength({ max: 80 }),

  sanitizeBody('userId').trim().escape(),
  sanitizeBody('comment').trim().escape(),
  sanitizeBody('id').trim().escape(),
];

inputValidator.commentGif = [
  body('comment').not().isEmpty().isLength({ max: 80 }),

  sanitizeBody('userId').trim().escape(),
  sanitizeBody('comment').trim().escape(),
  sanitizeBody('id').trim().escape(),
];

inputValidator.editArticle = [
  body('title').not().isEmpty().isLength({ max: 100 }),
  body('article').not().isEmpty().isLength({ max: 1000 }),

  sanitizeBody('userId').trim().escape(),
  sanitizeBody('id').trim().escape(),
  sanitizeBody('createdBy').trim().escape(),
  sanitizeBody('article').trim().escape(),
  sanitizeBody('title').trim().escape(),
  sanitizeBody('isAdmin').toBoolean(),
];

inputValidator.getArticlesByTag = [
  param('tag').not().isEmpty().isLength({ max: 50 }),

  sanitizeParam('tag').trim().escape(),
  sanitizeBody('userId').trim().escape(),
  sanitizeBody('isAdmin').toBoolean(),
];

inputValidator.flagArticleComment = [
  param('commentId').not().isEmpty().isLength({ max: 50 }),

  sanitizeParam('commentId').trim().escape(),
  sanitizeBody('userId').trim().escape(),
];

inputValidator.getArticlesById = [
  param('articleId').not().isEmpty(),

  sanitizeParam('articleId').trim().escape(),
  sanitizeBody('userId').trim().escape(),
  sanitizeBody('isAdmin').toBoolean(),
];

inputValidator.getFeeds = [
  sanitizeBody('userId').trim().escape(),
];

export default inputValidator;
