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

const queryShouldAbort = ( client, err ) => {
	if (err) {
	  console.error('Error in transaction', err.stack)
	  client.query('ROLLBACK', err => {
		if (err) {
		  console.error('Error rolling back client', err.stack)
		}
		// release the client back to the pool
		done()
	  })
	}
	return !!err
}

db.transactQuery = (queryArray) => {
	const len = queryArray.length
	return new Promise((resolve, reject) => {
		pool.connect(( err, client, done ) => {
			if(err) {
				reject({ error: 'DBrror' + err.stack })
			}			
			client.query('BEGIN', err => {
				for (let i = 0; i < len; i++) {
					if (queryShouldAbort(client, err)) return
						client.query(queryArray[i].text, queryArray[i].values, (err, res) => { })										
				}
				if (queryShouldAbort(client, err)) return
			  		client.query('COMMIT', err => {
						if (err) {
							console.log('Error committing transaction', err.stack)
							reject({error: 'Error committing transaction', data: err.stack})
						}
						resolve('done')
						done()
					})
			})
		})
	})
}

export default db