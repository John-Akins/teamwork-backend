import responseUtility from "../utilities/responseUtility"
import cloudinary from '../config/cloudinary'
import Datauri from 'datauri';
import path from 'path';
import db from "../db"
import comments from "./comments"

const gifController = {}
const dUri = new Datauri();
const uploader = cloudinary.uploader

const parseImageToStream = (req) => {
	return dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer).content
}

gifController.createGif = (req,res) => {	
	if(! req.file) {				
		return responseUtility.error(res, 401, 'Please select a gif file to upload')
	}	
	const file = parseImageToStream(req)
	uploader.upload(file)
	.then((image) => {
		const dateTime = new Date()
		const gifId = new Date().getTime()

		const query = {
			text: 'INSERT INTO gifs ("gifId", title, "imageUrl", "createdOn", "createdBy") values  ($1, $2, $3, $4, $5)',
			values: [gifId, req.body.title, image.url, dateTime, req.body.userId]
		}
		db.query(query)
		.then((response) => {
			const data = { status: "success", message: "GIF image successfully posted", gifId: gifId, createdOn: dateTime, title: req.body.title, token: req.headers.authorization.split()[1], userId: req.body.userId, imageUrl: image.url }
			responseUtility.success(res, data)				
		})
		.catch(( e ) => { 
			responseUtility.error(res, 400, 'someting went wrong while processing your request'+e)
		})		
	})
	.catch((e) => {
		return responseUtility.error(res, 400, 'someting went wrong while processing your request'+e)
	})
}

gifController.deleteGif  = (req,res) => {
	const query = {
		text: 'DELETE FROM gifs WHERE "gifId" = $1 ',
		values: [req.params.gifId]
	}

	db.query(query)
	.then((response) => {
		const data = {message: "Gif successfully deleted"}
		responseUtility.success(res,  data)
	})
	.catch(( error ) => { 
		responseUtility.error(res, 400, 'someting went wrong while processing your request'+error) 
	})
}

gifController.commentGif = (req, res) => {
	const { id, comment, userId } = req.body
    const dateTime = new Date()
	const randId = new Date().getTime()
	
	comments.add( id, randId, comment, dateTime,  'gif', userId )
		.then((response) => {
			const data = { message: "comment successfully created", commentId: randId, createdOn: dateTime, token : req.headers.authorization.split()[1], commentBy: userId, userId: userId }
			return responseUtility.success(res, data)
		})
		.catch(( error ) => { 
			responseUtility.error(res, 500, "server error") 
		})
}

export default gifController