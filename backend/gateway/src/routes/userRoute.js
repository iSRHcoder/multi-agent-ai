import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { getCurrentUser } from '../controllers/userController.js';

const userRoute = express.Router();

userRoute.get('/me', protect, getCurrentUser);

export default userRoute;
