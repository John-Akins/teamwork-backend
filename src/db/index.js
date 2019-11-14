import { Pool } from 'pg'
import configJson from '../config/config';

console.log("process.env.NODE_ENV")
console.log(process.env.NODE_ENV)

const env = ( process.env.NODE_ENV === undefined) ? 'test' : process.env.NODE_ENV.trim()

const { database, username, password, host } = configJson[env]

const connectionString = `postgressql://${username}:${password}@${host}:5432/${database}`

const pool = new Pool({connectionString : connectionString})
// the pool will emit an error on behalf of any idle clients it contains
// if a backend error or network partition happens

pool.on('error', (err) => {
	console.error('Unexpected error on idle client', err)
	process.exit(-1)
})

const db = {}

db.query = (queryString) =>  {
	return new Promise((resolve, reject) => {
		pool.connect((err, client, done) => {
			if(err) {
				reject({
					error: 'QueryError' + err.stack
				})
			}				
			client.query(queryString, (err,result) => {
				done()
				if(err) {
					reject({
						error: 'QueryError' + err.stack
					})
				}
				resolve(result)
			})
		})
	})
}

export default db