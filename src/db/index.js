const { Pool } = require("pg")
const connectionString = "postgressql://postgres:root@localhost:5432/teamwork"

const pool = new Pool({connectionString : connectionString})
// the pool will emit an error on behalf of any idle clients it contains
// if a backend error or network partition happens
pool.on("error", (err) => {
	console.error("Unexpected error on idle client", err)
	process.exit(-1)
})

exports.queryAll = (queryString) =>  {
	return new Promise((resolve, reject) => {
		pool.connect((err, client, done) => {	
			if(err){
				reject({
					error: "QueryError" + err.stack
				})
			}				
			client.query(queryString, (err,result) => {
			//call `done()` to release the client back to the pool
				done()
				if(err){
					reject({
						error: "QueryError" + err.stack
					})
				}
				resolve(result.rows)
			})
		})
	})
}

exports.queryWhere = (queryString, queryParam) =>  {
	return new Promise((resolve, reject) => {
		pool.connect((err, client, done) => {	
			if(err){
				reject({
					error: "QueryError" + err.stack
				})
			}				
			client.query(queryString, queryParam, (err,result) => {
			//call `done()` to release the client back to the pool
				done()
				if(err){
					reject({
						error: "QueryError" + err.stack
					})
				}
				resolve(result.rows)
			})
		})
	})
}