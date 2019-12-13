import path from 'path';
import Datauri from 'datauri';
const dUri = new Datauri();

const parseImageToStream = (req) => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer).content;

export default parseImageToStream