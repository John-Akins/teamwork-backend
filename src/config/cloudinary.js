import { config, uploader } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudinaryConfig = async (req, res, next) => {
  try {
    await config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
    await next();
  } catch (e) {
  //  console.log(e)
  }
};

export default { cloudinaryConfig, uploader };
