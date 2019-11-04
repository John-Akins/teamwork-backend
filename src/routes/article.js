const express = require("express")
//import auth from "../middleware/auth.js"
const articleCtrl = require("../controllers/article")

const router = express.Router()

router.get("/", articleCtrl.getAllArticles)
//router.get("/", auth, articleCtrl.getAllArticles)

module.exports = router 