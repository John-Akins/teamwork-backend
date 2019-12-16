/* eslint-disable linebreak-style */
import db from '../db';

const testQueries = {};


testQueries.getMaxArticle = () => new Promise((resolve, reject) => {
  db.query('SELECT title, "articleId" as id, "createdOn", "createdBy" as "authorId", article FROM articles WHERE "articleId" = (SELECT MAX("articleId") FROM articles)')
    .then((response) => {
      resolve(response.rows[0]);
    })
    .catch((error) => {
      reject(new Error({ status: 'error', error }));
    });
});

testQueries.getMaxGif = () => new Promise((resolve, reject) => {
  db.query('SELECT "gifId" as id, "createdBy" as "authorId" FROM gifs WHERE "gifId" = (SELECT MAX("gifId") FROM gifs)')
    .then((response) => { resolve(response.rows[0]); })
    .catch((error) => {
      reject(new Error({ status: 'error', error }));
    });
});

testQueries.commentOnArticle = () => new Promise((resolve, reject) => {
  const dateTime = new Date();
  const randId = new Date().getTime();

  const query = {
    text: 'INSERT INTO "feedComments" (id, "feedId", "feedType", comment, "commentOn", "commentBy", "isFlagged") values  ($1, $2, \'article\', $3, $4, $5, FALSE)',
    values: [randId, 10001, 'comment', dateTime, 10001]
  };

  db.query(query)
    .then(() => {
      resolve(randId);
    })
    .catch((error) => {
      reject(new Error(error));
    });
});


testQueries.createAndFlagComment = () => new Promise((resolve, reject) => {
  const dateTime = new Date();
  const randId = new Date().getTime();

  const query = {
    text: 'INSERT INTO "feedComments" (id, "feedId", "feedType", comment, "commentOn", "commentBy", "isFlagged") values  ($1, $2, \'article\', $3, $4, $5, TRUE)',
    values: [randId, 10001, 'comment', dateTime, 10001]
  };

  db.query(query)
    .then(() => {
      resolve(randId);
    })
    .catch((error) => {
      reject(new Error(error));
    });
});

testQueries.createAndFlagArticle = () => new Promise((resolve, reject) => {
  const dateTime = new Date();
  const articleId = new Date().getTime();
  const userId = 10001;
  const title = 'aksf akdfnak dkasnddlknsd';
  const article = 'aksf akdfnak sadlnasdfk sddknsdflkas asdl;kkansdknasd dkasnddlknsd';
  const randomId = new Date().getTime();

  const queryArray = [
    {
      text: 'INSERT INTO articles ("title", "articleId", "createdOn", "createdBy", "article", "isEdited", "isFlagged") values  ($1, $2, $3, $4, $5, FALSE, TRUE)',
      values: [title, articleId, dateTime, userId, article]
    },
    {
      text: 'INSERT INTO "flaggedFeeds"( "flagId", "feedId", "feedType", "flaggedOn", "flaggedBy") VALUES ($1, $2, $3, $4, $5)',
      values: [randomId, articleId, 'article', dateTime, userId]
    }
  ];

  db.transactQuery(queryArray)
    .then(() => {
      resolve({ id: articleId, article, title });
    })
    .catch((error) => {
      reject(new Error({ status: 'error', error }));
    });
});

testQueries.createUser = () => new Promise((resolve, reject) => {
  const randId = new Date().getTime();

  const query = {
    text: 'INSERT INTO users("userId", "firstName", "lastName", "email", "address", "password", "gender", "jobRole", "department", "isAdmin", "imageUrl", "isNewAccount") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', values: [randId, 'demo', 'demo', `${randId}email@gmail.com`, 'address', 'hash', 'gender', 'jobRole', 'department', false, 'image.url', true],
  };

  db.query(query)
    .then(() => {
      resolve(randId);
    })
    .catch((error) => {
      reject(new Error(error));
    });
});

export default testQueries;
