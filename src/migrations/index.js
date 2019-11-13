import db from "../db"

const dbMigration = {}

dbMigration.tableExists = (table) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${table}`
        db.query(query)
        .then(() => {
            resolve(true)
        })
        .catch((error) => {
            reject(false)
        })
    })
}

dbMigration.tablesAndQueries = [
    {
        table: "users", 
        query: 'CREATE TABLE users ( "userId" bigint NOT NULL, "firstName" character varying(30) NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "address" character varying NOT NULL, "password" character varying NOT NULL, "gender" character varying NOT NULL, "jobRole" character varying NOT NULL, "department" character varying NOT NULL, "isAdmin" boolean NOT NULL, "isNewAccount" boolean DEFAULT true NOT NULL )'
    },

    {
        table: "articles",
        query: 'CREATE TABLE articles ( "title" character(100) NOT NULL, "articleId" bigint NOT NULL, "createdOn" date NOT NULL, "createdBy" character varying(20) NOT NULL, "article" character(1000) NOT NULL )'
    },

    {
        table: "feedComments",
        query: 'CREATE TABLE "feedComments" ( "feedId" bigint NOT NULL, "commentId" bigint NOT NULL, "feedType" character(20) NOT NULL, "comment" character(500) NOT NULL, "commentOn" date NOT NULL, "commentBy" bigint NOT NULL, "isFlagged" boolean )'
    },

    {
        table: "feedFlags",
        query: 'CREATE TABLE "feedFlags" ( "flagId" bigint NOT NULL, "feedId" bigint NOT NULL, "feedType" character(20) NOT NULL, "flaggedOn" date, "flaggedBy" character(20) )'
    },

    {
        table: "gifs",
        query: 'CREATE TABLE gifs ( "gifId" bigint NOT NULL, "title" character(100) NOT NULL, "imageUrl" character(100) NOT NULL, "createdOn" date NOT NULL, "createdBy" character(20)[] NOT NULL )'
    }
]

dbMigration.hasCreatedTables = false

dbMigration.createTablesIfNotExists = () => {
        const tablesAndQueries = dbMigration.tablesAndQueries
        for (let i = 0; i < tablesAndQueries.length; i++) 
        {
            const table = tablesAndQueries[i].table
            const tableQuery = tablesAndQueries[i].query
            // check if table exists
            dbMigration.tableExists(table)
            .then(res => {
                dbMigration.hasCreatedTables = (i === 0) ? true : dbMigration.hasCreatedTables
                dbMigration.hasCreatedTables = dbMigration.hasCreatedTables && res
            })
            .catch(error => {
                db.query(tableQuery)
                .then((resp) => {
                    dbMigration.hasCreatedTables = (i === 0) ? true : dbMigration.hasCreatedTables
                    dbMigration.hasCreatedTables = dbMigration.hasCreatedTables && true
                })
                .catch( (error) => {
                    dbMigration.hasCreatedTables = (i === 0) ? true : dbMigration.hasCreatedTables
                    dbMigration.hasCreatedTables = dbMigration.hasCreatedTables && error
                })
            })
        }
        return dbMigration.hasCreatedTables
}

dbMigration.dummyQueries = [

    {
        table: "articles",
        query: 'INSERT INTO articles ("title", "articleId", "createdOn", "createdBy", "article") values  ($1, $2, $3,	$4, $5)',
        values: ['Ada Lovelace', 10003, '2019-10-12',	10002, 'A computer science fairy tale']

    },
    {
        table: "articles",
        query: 'INSERT INTO articles ("title", "articleId", "createdOn", "createdBy", "article") values  ($1, $2, $3,	$4, $5)',
        values: ['Quick brown fox', 10002, '2019-11-12',10002, 'One Hell of a quick brown fox']
    },
    {
        table: "articles",
        query: 'INSERT INTO articles ("title", "articleId", "createdOn", "createdBy", "article") values  ($1, $2, $3,	$4, $5)',

        values: ['Ada Lovelace', 10003, '2019-10-12',	10002, 'A computer science fairy tale']
    },
    {
        table: "users",
        query: 'INSERT INTO users ("userId", "firstName", "lastName", "email", "address", "password", "gender", "jobRole", "department", "isAdmin", "isNewAccount") values ($1, $2, $3, $4, $5, $6, $7, $8, %9, $10, $11)',
        values: [10001, 'Ada', 'Lovelace', 'lovelace@gmail.com', 'LOvelace street', '$2b$10$dTlK9RWsDFxj0jvAARftqeonxRuBVTQVKpsbvk9tt.MsFcjnTjpxa', 'female',	'Software Engineer', 'IT',	true,	false]
    },
    {
        table: "users",
        query: 'INSERT INTO users ("userId", "firstName", "lastName", "email", "address", "password", "gender", "jobRole", "department", "isAdmin", "isNewAccount") values ($1, $2, $3, $4, $5, $6, $7, $8, %9, $10, $11)',
        values: [10002, 'Ada', 'Turan', 'turan@gmail.com', 'Turan street', '$2b$10$dTlK9RWsDFxj0jvAARftqeonxRuBVTQVKpsbvk9tt.MsFcjnTjpxa',	'male',	'Software Engineer', 'IT',	false,	false]
    },

    {
        table: "feedComments",
        query: 'INSERT INTO  "feedComments" ("feedId", "commentId", "feedType", "comment", "commentOn", "commentBy", "isFlagged") values ($1, $2, $3, $4, $5, $6, $7)',
        values: [10001, 10001,'article', 'Very nice', '2019-10-10', 10001, false]
    },
    {
        table: "feedComments",
        query: 'INSERT INTO  "feedComments" ("feedId", "commentId", "feedType", "comment", "commentOn", "commentBy", "isFlagged") values ($1, $2, $3, $4, $5, $6, $7)',
        values:[10002, 10002,	'article', 'Very nice', '2019-10-10', 10001, false]
    }

]

dbMigration.dummyQueriesExecuted = false

dbMigration.fillDummyData = () => {
    const dummyQueries = dbMigration.dummyQueries
    const len = dummyQueries.length
    for (let i = 0; i < len; i++) {        
        db.query(dummyQueries[i].query)
        .then((response) => {
            dbMigration.dummyQueriesExecuted = (i === 0) ? true : dbMigration.dummyQueriesExecuted

            console.log("fill dummy data")
            console.log(dummyQueries[i].query)        
    
            console.log("table insert response")
            console.log(response)
            dbMigration.dummyQueriesExecuted = dbMigration.dummyQueriesExecuted && true            
        })
        .catch((error) => {
            dbMigration.dummyQueriesExecuted = (i === 0) ? true : dbMigration.dummyQueriesExecuted

            console.log("table insert error")
            console.log(error)
            dbMigration.dummyQueriesExecuted = dbMigration.dummyQueriesExecuted && false
        })
    }
    return dbMigration.dummyQueriesExecuted;
}

export default dbMigration