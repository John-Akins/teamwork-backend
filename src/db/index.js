import { Client } from 'pg'
import configJson from '../config/config';

console.log("process.env.NODE_ENV")
console.log(process.env.NODE_ENV)
const p = 0;
const env = ( process.env.NODE_ENV === undefined ) ? 'development' : process.env.NODE_ENV.trim()

console.log("env::")
console.log(env)

const connection = {}

if( env === 'elephantsql' ) {
	connection.String = 'postgres://qulzkjox:1pRx-JXE-Ixnq6x2a1_tB35VS2lmiUNl@manny.db.elephantsql.com:5432/qulzkjox'	
} else {
	const { database, username, password, host } = configJson[env]
	connection.String = `postgressql://${username}:${password}@${host}:5432/${database}`
}

console.log("connectionString ::::::: ")
console.log(connection.String)

const client = new Client({connectionString : connection.String})

client.connect()
client.on('error', err => {
	console.log('something bad has happened!', err.stack)
})
client.on('notice', msg => console.log('notice:', msg))

const db = {}

db.query = (queryString) =>  {
	return new Promise((resolve,reject) => {
			client.query(queryString, (err, result) => {
				if (err) {
					console.log('Error executing query', err.stack)
					reject({msg:'Error executing query', data: err.stack})
				}
				resolve(result)
			})				
		})
}

db.transactQuery = (queryArray) => {
	return new Promise((resolve,reject) => {
		const len = queryArray.length
				for (let i = 0; i < len; i++ ) {
					client.query(queryArray[i].text, queryArray[i].values, (err, result) => {
						if (err) {
							console.log('Error executing query', err.stack)
							reject({msg:'Error executing query', data: err.stack})
						}
					})
				}
				resolve(true)
			})
}

export default db