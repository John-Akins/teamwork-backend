import { config, uploader } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudinaryConfig = async (req, res, next) => {
  try {
    await config({
      cloud_name: 'dydyvjqpb',
      api_key: '363896915296551',
      api_secret: 'QjHmaHA_BfBUpsT20iRMV8uzCKA',
    });
    await next();
  } catch (e) {
  //  console.log(e)
  }
};

export default { cloudinaryConfig, uploader };