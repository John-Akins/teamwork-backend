import { Pool } from 'pg'
import configJson from '../config/config';

console.log("process.env.NODE_ENV")
console.log(process.env.NODE_ENV)

const env = ( process.env.NODE_ENV === undefined ) ? 'development' : process.env.NODE_ENV.trim()
const connection = {}
if( env === 'elephantsql' ) {
	connection.String = 'postgres://qulzkjox:1pRx-JXE-Ixnq6x2a1_tB35VS2lmiUNl@manny.db.elephantsql.com:5432/qulzkjox'	
} else {
	const { database, username, password, host } = configJson[env]
	connection.String = `postgressql://${username}:${password}@${host}:5432/${database}`
}

console.log("connectionString ::::::: ")
console.log(connection.String)

const pool = new Pool({connectionString : connection.String})

pool.on('error', (err) => {
	console.error('Unexpected error on idle client', err)
	process.exit(-1)
})

const db = {}

db.query = (queryString) =>  {
	return new Promise((resolve, reject) => {
		pool.connect((err, client, done) => {
			console.log("dbError ::::::::")
			console.log(err)
			if(err) {
				reject({
					error: 'dbError' + err.stack
				})
			}				
			client.query(queryString, (err,result) => {
				done()
				console.log("QueryError ::::::::")
				console.log(err)
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
	console.log('Error in transaction:::::: ')
	console.log(err)
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

/*
db.tablesMigrate = (queryArray) => {
	return new Promise((resolve, reject) => {
		pool.connect(( err, client, done ) => {
			console.log("dbError ::::::::")
			console.log(err)
			if(err) {
				reject({ error: 'DBrror' + err.stack })
			}			
			client.query('BEGIN', err => {
				const len = queryArray.length
				for (let i = 0; i < len; i++) {
					console.log("BEGIN ::::::::"+i)
					if (queryShouldAbort(client, err)) return
						client.query(queryArray[i].text, (err, res) => {
							console.log("query err")
							console.log(err)
						})										
				}
				console.log('FINISHED')
				if (queryShouldAbort(client, err)) return
				console.log('WILL COMMIT')
				client.query('COMMIT', err => {
						console.log('COMMIT')
						console.log(err)
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
*/

export default db