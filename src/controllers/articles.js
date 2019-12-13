/* eslint-disable linebreak-style */
import responseUtility from '../utilities/responseUtility';
import db from '../db';
import comments from './comments';

const articlesController = {};

const isArticleFlagged = (articleId) => new Promise((resolve, reject) => {
  const query = {
    text: 'SELECT title, "articleId" as id, "createdOn", "createdBy" as "authorId", article FROM articles WHERE "articleId" = $1 AND "isFlagged" = TRUE',
    values: [articleId],
  };
  db.query(query)
    .then((response) => {
      const data = response.rows;
      if (data[0] !== undefined && typeof data[0].title === 'string') {
        resolve(true);
      }
      resolve(false);
    })
    .catch(() => {
      reject(new Error(false));
    });
});

articlesController.createArticle = (req, res) => {
  const { title, article } = req.body;
  const dateTime = new Date();
  const articleId = new Date().getTime();

  const query = {
    text: 'INSERT INTO articles (title, "articleId", "createdOn", "createdBy", article, "isEdited") values  ($1, $2, $3, $4, $5, FALSE)',
    values: [title, articleId, dateTime, req.headers.authorization.split(' ')[3], article],
  };
  db.query(query)
    .then(() => {
      const data = {
        message: 'Article successfully posted', articleId, createdOn: dateTime, title, createdBy: req.headers.authorization.split(' ')[3],
      };
      responseUtility.success(res, data);
    })
    .catch((error) => {
      responseUtility.error(res, 500, 'someting went wrong while processing your request');
    });
};

articlesController.commentArticle = (req, res) => {
  const { id, comment } = req.body;
  const dateTime = new Date();
  const randId = new Date().getTime();

  comments.add(id, randId, comment, dateTime, 'article', req.headers.authorization.split(' ')[3])
    .then(() => {
      const data = {
        message: 'comment posted succesfully', commentId: randId, createdOn: dateTime, commentBy: req.headers.authorization.split(' ')[3],
      };
      return responseUtility.success(res, data);
    })
    .catch((error) => responseUtility.error(res, 500, 'someting went wrong while processing your request'));
};

articlesController.editArticle = (req, res) => {
  const { title, article, articleId } = req.body;

  const query = {
    text: 'UPDATE articles SET title=$1, article=$2, "isEdited"=TRUE WHERE  "articleId"=$3 ',
    values: [title, article, articleId],
  };
  db.query(query)
    .then(() => {
      const data = {
        message: 'Article successfully updated', articleId, title, article,
      };
      responseUtility.success(res, data);
    })
    .catch((error) => responseUtility.error(res, 500, 'someting went wrong while processing your request'));
};

articlesController.flagArticle = (req, res) => {
  const randomId = new Date().getTime();
  const dateTime = new Date();

  const queryArray = [
    {
      text: 'UPDATE articles SET "isFlagged"=TRUE WHERE "articleId"=$1 ', values: [req.params.articleId],
    },
    {
      text: 'INSERT INTO "flaggedFeeds"( "flagId", "feedId", "feedType", "flaggedOn", "flaggedBy") VALUES ($1, $2, $3, $4, $5)', values: [randomId, req.params.articleId, 'article', dateTime, req.headers.authorization.split(' ')[3]],
    },
  ];
  db.transactQuery(queryArray)
    .then(() => {
      const data = { message: 'Article successfully flagged as inappropriate' };
      responseUtility.success(res, data);
    })
    .catch((error) => responseUtility.error(res, 500, 'someting went wrong while processing your request'));
};

articlesController.flagArticleComment = (req, res) => {
  comments.flag(req.params.commentId, 'article')
    .then((response) => {
      if (response !== 'success') {
        return responseUtility.error(res, 401, response.msg);
      }
      const data = { message: 'Comment successfully flagged as inappropriate' };
      responseUtility.success(res, data);
    })
    .catch((error) => responseUtility.error(res, 500, 'someting went wrong while processing your request'));
};

articlesController.deleteFlaggedComment = (req, res) => {
  comments.deleteFlagged(req.params.commentId)
    .then((response) => {
      if (response !== 'success') {
        return responseUtility.error(res, 401, response.msg);
      }
      const data = { message: 'Comment successfully deleted' };
      return responseUtility.success(res, data);
    })
    .catch((error) => responseUtility.error(res, 500, 'someting went wrong while processing your request'));
};

articlesController.deleteFlaggedArticle = (req, res) => {
  isArticleFlagged(req.params.articleId)
    .then((isFlagged) => {
      if (isFlagged === false) {
        return responseUtility.error(res, 401, 'You cannot delete an unflagged article, want to flag as inappropriate?');
      }
      const queryArray = [
        { text: 'DELETE FROM articles WHERE  "articleId"=$1', values: [req.params.articleId] },
        { text: 'DELETE FROM "flaggedFeeds" WHERE "feedId"=$1 ', values: [req.params.articleId] },
      ];
      db.transactQuery(queryArray)
        .then(() => {
          const data = {
            message: 'Article successfully deleted',
          };
          responseUtility.success(res, data);
        })
        .catch((error) => responseUtility.error(res, 500, 'someting went wrong while processing your request'));
    })
    .catch((error) => responseUtility.error(res, 500, 'someting went wrong while processing your request'));
};

articlesController.getArticlesByTag = (req, res) => {
  const query = {
    text: 'SELECT a.title, a."articleId" as id, a."createdOn", a."createdBy" as "authorId", a.article FROM articles as a  INNER JOIN "articleTags" ON "articleTags"."articleId" = a."articleId" INNER JOIN tags ON tags.id = "articleTags"."tagId" WHERE tags.name = $1 ORDER BY "createdOn" desc ',
    values: [req.params.tag],
  };
  db.query(query)
    .then((response) => {
      responseUtility.success(res, response.rows);
    })
    .catch((error) => responseUtility.error(res, 500, 'someting went wrong while processing your request'));
};

articlesController.getArticlesById = (req, res) => {
  (async () => {
    const query = {
      text: 'SELECT title, "articleId" as "id", "createdOn", "createdBy" as "authorId", article FROM "public"."articles" WHERE "articleId" = $1 ',
      values: [req.params.articleId],
    };
    try {
      const response = await db.query(query);
      if (response.rowCount > 0) {
        response.rows[0].comments = await comments.getByFeedId(req.params.articleId, 'article');
        return responseUtility.success(res, response.rows[0]);
      }
      responseUtility.error(res, 400, 'This article does not exist');
    } catch (error) {
      responseUtility.error(res, 500, 'someting went wrong while processing your request');
    }
  })();
};

articlesController.deleteArticlesById = (req, res) => {
  const query = {
    text: 'DELETE FROM articles WHERE "articleId" = $1 ',
    values: [req.params.articleId],
  };
  db.query(query)
    .then(() => {
      const data = { message: 'Article successfully deleted' };
      responseUtility.success(res, data);
    })
    .catch((error) => responseUtility.error(res, 500, 'someting went wrong while processing your request'));
};

export default articlesController;
