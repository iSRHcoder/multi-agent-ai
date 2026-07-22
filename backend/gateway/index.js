import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import proxy from 'express-http-proxy';
import cookieParser from 'cookie-parser';
import userRoute from './src/routes/userRoute.js';
import { proxyWithHeader } from './utils/proxyWithHeader.js';
import protect from './src/middlewares/authMiddleware.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', proxy(process.env.AUTH_SERVICE));
app.use('/api/chat', protect, proxyWithHeader(process.env.CHAT_SERVICE));
app.use('/api', userRoute);

app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Gateway server is healthy',
    status: 'success',
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`gateway started at port - ${PORT}`);
});
