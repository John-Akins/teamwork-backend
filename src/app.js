import express from 'express';
import { json, urlencoded } from 'body-parser';
import authRoutes from './routes/auth';
import articlesRoutes from './routes/articles';
import gifRoutes from './routes/gif';
import feedRoutes from './routes/feeds';
import usersRoutes from './routes/users'
import cloudinary from './config/cloudinary';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/v1/gifs', cloudinary.cloudinaryConfig, gifRoutes);
app.use('/api/v1/auth', cloudinary.cloudinaryConfig, authRoutes);
app.use('/api/v1/articles', articlesRoutes);
app.use('/api/v1/feed', feedRoutes);
app.use('/api/v1/users', cloudinary.cloudinaryConfig, usersRoutes);

export default app;
