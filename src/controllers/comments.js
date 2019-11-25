/* eslint-disable linebreak-style */
import db from '../db';

const comments = {};

comments.getByFeedId = (feedId, feedType) => new Promise((resolve, reject) => {
  const query = {
    text: 'SELECT * FROM "feedComments" WHERE "feedId" = $1 AND "feedType" = $2',
    values: [parseInt(feedId, 10), feedType],
  };

  db.query(query)
    .then((response) => {
      if (response.rows[0] !== undefined && typeof response.rows[0].comment === 'string') {
        resolve(response.rows);
      }
      resolve([]);
    })
    .catch(() => {
      reject(new Error(false));
    });
});

comments.exists = async (commentId) => {
  try {
    const query = {
      text: 'SELECT * FROM "feedComments" WHERE id = $1',
      values: [commentId],
    };
    const { rows } = await db.query(query);
    return !!((rows[0] !== undefined && typeof rows[0].comment === 'string'));
  }
  catch (e) {
    return false;
  }
};

comments.existsAndFlagged = async (commentId) => {
  try {
    const commentExists = await comments.exists(commentId);
    if (commentExists === false) {
      return { status: 'error', msg: 'Oopsie, comment cannot be found' };
    }
    const query = { text: 'SELECT * FROM "feedComments" WHERE id = $1 AND "isFlagged" = TRUE', values: [commentId] };
    const response = await db.query(query);
    const data = response.rows;
    if (data[0] !== undefined && typeof data[0].comment === 'string') {
      return { status: 'success' };
    }
    return { status: 'error', msg: 'You cannot delete an unflagged comment, want to flag as inappropriate?' };
  }
  catch (e) {
    return { status: 'error', msg:'Oopsie, comment cannot be found' };
  }
};

comments.flag = async (commentId) => {
  try {
    const commentExists = await comments.exists(commentId);
    if (commentExists === false) {
      return { status: 'error', msg: 'Oopsy, comment cannot be found' };
    }
    const query = {
      text: 'UPDATE "feedComments" SET "isFlagged"=TRUE WHERE  "id"=$1 ',
      values: [commentId],
    };
    await db.query(query);
    return 'success';
  }
  catch (e) {
    return { status: 'error', msg: 'Oopsy, comment cannot be found' };
  }
};

comments.add = async (id, randId, comment, dateTime, feedType, userId) => {
  try {
    const query = {
      name: 'add-comment',
      text: 'INSERT INTO "feedComments" (id, "feedId", "feedType", comment, "commentOn", "commentBy", "isFlagged") values  ($1, $2, $3, $4, $5, $6, FALSE)',
      values: [randId, id, feedType, comment, dateTime, userId],
    };
    await db.query(query);
    return 'success';
  }
  catch (e) {
    return 'failse';
  }
};

comments.deleteFlagged = async (commentId) => {
  try {
    const response = await comments.existsAndFlagged(commentId);
    if ( response.status !== 'success' ) {
      return response;
    }
    const query = {
      text: 'DELETE FROM "feedComments" WHERE  id = $1 ',
      values: [commentId],
    };
    await db.query(query);
    return 'success';
  } catch (e) {
    return { status: 'error', msg: 'Oopsie, comment cannot be found' };
  }
};


export default comments;