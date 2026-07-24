import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/config/db.js';
import authRouter from './src/routes/authRoute.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use('', authRouter);

//----------health check-------------
app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Auth server is healthy',
    status: 'success',
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Auth started at port - ${PORT}`);
  connectDB();
});
