/* eslint-disable linebreak-style */
import responseUtility from '../utilities/responseUtility';
import db from '../db';

const feedController = {};

feedController.getFeeds = (req, res) => {
  const query = 'SELECT  "articleId" as id, title, "createdOn", "createdBy" as "authorId", \'article\' AS type  FROM articles UNION  SELECT "gifId" as id, title, "createdOn", "createdBy" as "authorId", \'gif\' AS type  FROM gifs ORDER BY "createdOn" DESC';
  db.query(query)
    .then((response) => {
      responseUtility.success(res, response.rows);
    })
    .catch(( error ) => { 
      return responseUtility.error(res, 400, 'someting went wrong while processing your request');
    });
};

export default feedController;
