const express = require("express")
const  { json } = require("body-parser")

const articleRoutes = require("./routes/article")
const authRoutes = require("./routes/auth")

const app = express()

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization")
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
	next()
})

app.use(json())

app.use("/api/v1/article", articleRoutes)
app.use("/api/v1/auth", authRoutes)

module.exports = app