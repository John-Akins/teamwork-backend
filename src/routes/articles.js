/* eslint-disable linebreak-style */
import express from 'express';
import inputValidator from '../middleware/input-validator';
import auth from '../middleware/auth';
import articlesController from '../controllers/articles';
import validateRequest from '../utilities/validateRequest';

const router = express.Router();

router.post('/', auth.allUsers, inputValidator.createArticle, validateRequest, articlesController.createArticle);

router.post('/:id/comment', auth.allUsers, inputValidator.commentArticle, validateRequest, articlesController.commentArticle);

router.patch('/comments/:commentId/flag', auth.allUsers, inputValidator.flagArticleComment, validateRequest, articlesController.flagArticleComment);

router.delete('/comments/:commentId/flagged', auth.adminOnly, inputValidator.flagArticleComment, validateRequest, articlesController.deleteFlaggedComment);

router.patch('/:articleId', auth.allUsers, auth.userIdMatchesAuthorId, inputValidator.editArticle, validateRequest, articlesController.editArticle);

router.patch('/:articleId/flag', auth.allUsers, inputValidator.getArticlesById, validateRequest, articlesController.flagArticle);

router.get('/:articleId', auth.allUsers, inputValidator.getArticlesById, validateRequest, articlesController.getArticlesById);

router.get('/tags/:tag', auth.allUsers, inputValidator.getArticlesByTag, validateRequest, articlesController.getArticlesByTag);

router.delete('/:articleId', auth.allUsers, auth.userIdMatchesAuthorId, validateRequest, inputValidator.getArticlesById, articlesController.deleteArticlesById);

router.delete('/flagged/:articleId', auth.adminOnly, inputValidator.getArticlesById, validateRequest, articlesController.deleteFlaggedArticle);

export default router;