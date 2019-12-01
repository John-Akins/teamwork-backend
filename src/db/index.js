import { Client } from 'pg';

require('dotenv').config();

const env = (process.env.NODE_ENV === undefined) ? 'development' : process.env.NODE_ENV.trim();
const connection = {};

connection.String = (env === 'development') ? process.env.DB_DEV_URL : process.env.DB_TEST_URL;

const client = new Client({ connectionString: connection.String });

client.connect();

const db = {};

db.query = (queryString) => new Promise((resolve, reject) => {
  client.query(queryString, (err, result) => {
    if (err) {
      reject(new Error({ msg: 'Error executing query', data: err.stack }));
    }
    resolve(result);
  });
});

db.transactQuery = (queryArray) => new Promise((resolve, reject) => {
  const len = queryArray.length;
  for (let i = 0; i < len; i += 1) {
    client.query(queryArray[i].text, queryArray[i].values, (err) => {
      if (err) {
        reject(new Error({ msg: 'Error executing query', data: err.stack }));
      }
    });
  }
  resolve(true);
});

export default db;
