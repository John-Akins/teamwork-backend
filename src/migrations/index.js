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

dbMigration.createTables = () => {
        const tablesAndQueries = dbMigration.tablesAndQueries
        for (let i = 0; i < tablesAndQueries.length; i++) 
        {
            const tableQuery = tablesAndQueries[i].query
                db.query(tableQuery)
                .then((resp) => {
                })
                .catch( (error) => {
                    return false
                })
        }
        return true
}

dbMigration.dummyQueries = [

    {
        table: "articles",
        query: 'INSERT INTO articles ("title", "articleId", "createdOn", "createdBy", "article") values  (\'Ada Lovelace\', 10003, \'2019-10-12\',	10002, \'A computer science fairy tale\')',

    },
    {
        table: "articles",
        query: 'INSERT INTO articles ("title", "articleId", "createdOn", "createdBy", "article") values  (\'Quick brown fox\', 10002, \'2019-11-12\',10002, \'One Hell of a quick brown fox\')'
    },
    {
        table: "articles",
        query: 'INSERT INTO articles ("title", "articleId", "createdOn", "createdBy", "article") values  (\'Ada Lovelace\', 10003, \'2019-10-12\',	10002, \'A computer science fairy tale\')'
    },
    {
        table: "users",
        query: 'INSERT INTO users ("userId", "firstName", "lastName", "email", "address", "password", "gender", "jobRole", "department", "isAdmin", "isNewAccount") values (10001, \'Ada\', \'Lovelace\', \'lovelace@gmail.com\', \'LOvelace street\', \'$2b$10$dTlK9RWsDFxj0jvAARftqeonxRuBVTQVKpsbvk9tt.MsFcjnTjpxa\', \'female\',	\'Software Engineer\', \'IT\',	TRUE,	FALSE)',
    },
    {
        table: "users",
        query: 'INSERT INTO users ("userId", "firstName", "lastName", "email", "address", "password", "gender", "jobRole", "department", "isAdmin", "isNewAccount") values (10002, \'Ada\', \'Lovelace\', \'lovelace@gmail.com\', \'LOvelace street\', \'$2b$10$dTlK9RWsDFxj0jvAARftqeonxRuBVTQVKpsbvk9tt.MsFcjnTjpxa\', \'female\',	\'Software Engineer\', \'IT\',	FALSE,	FALSE)'
    },

    {
        table: "feedComments",
        query: 'INSERT INTO  "feedComments" ("feedId", "commentId", "feedType", "comment", "commentOn", "commentBy", "isFlagged") values (10001, 10001, \'article\', \'Very nice\', \'2019-10-10\', 10001, FALSE)'
    },
    {
        table: "feedComments",
        query: 'INSERT INTO  "feedComments" ("feedId", "commentId", "feedType", "comment", "commentOn", "commentBy", "isFlagged") values (10002, 10002, \'article\', \'Very nice\', \'2019-10-10\', 10001, FALSE)'
    }

]



dbMigration.fillDummyData = () => {
    const dummyQueries = dbMigration.dummyQueries
    const len = dummyQueries.length
    for (let i = 0; i < len; i++) {
        db.queryWhere(dummyQueries[i].query)
        .then((response) => {
            db.queryAll("SELECT * FROM " + dummyQueries[i].table)
            .then((res)=> {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })

            console.log("fill dummy data")
            console.log(dummyQueries[i].query)        
    
            console.log("table insert response")
            console.log(response)
        })
        .catch((error) => {
            console.log("table insert error")
            console.log(error)
            return false
        })
    }
    return true
}

export default dbMigration
