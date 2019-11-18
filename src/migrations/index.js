import db from "../db"

const dbMigration = {}

dbMigration.tablesAndQueries = [

    {
        text: 'CREATE TABLE IF NOT EXISTS users ( "userId" bigint NOT NULL, "firstName" character varying(30) NOT NULL, "lastName" character varying NOT NULL, email character varying NOT NULL, address character varying NOT NULL, password character varying NOT NULL, gender character varying NOT NULL, "jobRole" character varying NOT NULL, department character varying NOT NULL, "isAdmin" boolean NOT NULL, "isNewAccount" boolean DEFAULT true NOT NULL,  CONSTRAINT users_pkey PRIMARY KEY ("userId")    )'
    },
    {
        text: 'CREATE TABLE IF NOT EXISTS tags ( id bigint NOT NULL,  name character(20) NOT NULL,  CONSTRAINT tags_pkey PRIMARY KEY (id) )'
    },   
    {
        text: 'CREATE TABLE IF NOT EXISTS articles ( title character(100) NOT NULL, "articleId" bigint NOT NULL, "createdOn" date NOT NULL, "createdBy" character varying(20) NOT NULL, article character(1000) NOT NULL, "isEdited" boolean, "isFlagged" boolean, CONSTRAINT articles_pkey PRIMARY KEY ("articleId")    )'
    },
    {
        text: 'CREATE TABLE IF NOT EXISTS "feedComments" ( id bigint NOT NULL,"feedId" bigint NOT NULL, "commentId" bigint NOT NULL, "feedType" character(20) NOT NULL, comment character(500) NOT NULL, "commentOn" date NOT NULL, "commentBy" bigint NOT NULL, "isFlagged" boolean,  CONSTRAINT "feedComments_pkey" PRIMARY KEY (id)   )'
    },
    {
        text: 'CREATE TABLE IF NOT EXISTS "flaggedFeeds" ( "flagId" bigint NOT NULL, "feedId" bigint NOT NULL, "feedType" character(20) NOT NULL, "flaggedOn" date, "flaggedBy" character(20) NOT NULL,  CONSTRAINT "flaggedFeeds_pkey" PRIMARY KEY ("flagId")   )'
    },
    {
        text: 'CREATE TABLE IF NOT EXISTS gifs ( "gifId" bigint NOT NULL, title character(100) NOT NULL, "imageUrl" character(100) NOT NULL, "createdOn" date NOT NULL, "createdBy" character(20)[] NOT NULL,  CONSTRAINT gifs_pkey PRIMARY KEY ("gifId")   )'
    },
    {
        text: 'CREATE TABLE IF NOT EXISTS "articleTags" (id bigint NOT NULL, "tagId" bigint NOT NULL, "articleId" bigint NOT NULL,  CONSTRAINT "articleTags_pkey" PRIMARY KEY (id)  )'
    }

]



dbMigration.createTables =  () => {
    db.tablesMigrate(dbMigration.tablesAndQueries)
    .then((response) => {
        console.log("table create response :::::::::::::::")
        console.log(response)
        return true
    })
    .catch( (e) => {
        console.log("tables create error")
        console.log(e)
        return false
    })
}

dbMigration.dummyQueries = [

    {
        table: "articles",
        query: 'INSERT INTO articles ("title", "articleId", "createdOn", "createdBy", "article") values  (\'Ada Lovelace\', 10001, \'2019-10-12\',	10001, \'A computer science fairy tale\')'
    },
    {
        table: "articles",
        query: 'INSERT INTO articles ("title", "articleId", "createdOn", "createdBy", "article", "isEdited", "isFlagged") values  (\'Quick brown fox\', 10002, \'2019-11-12\',10002, \'One Hell of a quick brown fox\', FALSE, FALSE)'
    },
    {
        table: "users",
        query: 'INSERT INTO users ("userId", "firstName", "lastName", "email", "address", "password", "gender", "jobRole", "department", "isAdmin", "isNewAccount") values (10001, \'Ada\', \'Lovelace\', \'lovelace@gmail.com\', \'LOvelace street\', \'$2b$10$dTlK9RWsDFxj0jvAARftqeonxRuBVTQVKpsbvk9tt.MsFcjnTjpxa\', \'female\',	\'Software Engineer\', \'IT\',	TRUE,	FALSE)'
    },
    {
        table: "users",
        query: 'INSERT INTO users ("userId", "firstName", "lastName", "email", "address", "password", "gender", "jobRole", "department", "isAdmin", "isNewAccount") values (10002, \'Ada\', \'Turan\', \'turan@gmail.com\', \'LOvelace street\', \'$2b$10$dTlK9RWsDFxj0jvAARftqeonxRuBVTQVKpsbvk9tt.MsFcjnTjpxa\', \'female\',	\'Software Engineer\', \'IT\',	FALSE,	FALSE)'
    },
    {
        table: "tags",
        query: 'INSERT INTO tags ("id", "name") values (10001, \'news\')'
    },
    {
        table: "tags",
        query: 'INSERT INTO tags ("id", "name") values (10002, \'productivity\')'
    },
    {
        table: "tags",
        query: 'INSERT INTO tags ("id", "name") values (10003, \'creativity\')'
    }

]



dbMigration.fillDummyData = () => {
    const dummyQueries = dbMigration.dummyQueries
    const len = dummyQueries.length
    for (let i = 0; i < len; i++) {
        db.query(dummyQueries[i].query)
        .then((response) => {
            /* debug insert 
            db.query(`SELECT * FROM ${dummyQueries[i].table}`)
			.then((response) => {
                console.log("table insert response")
                console.log(response.rows[0])
			})
			.catch((error) => {
				console.log({status: "error", error: error})
            })
            */
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
