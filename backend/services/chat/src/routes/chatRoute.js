import express from 'express';
import { createConnection } from 'mongoose';
import {
  getConversations,
  getMessage,
  saveMessage,
  updateConversation,
} from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.get('/create-conversation', createConnection);
chatRouter.get('/get-conversations', getConversations);
chatRouter.post('/update-conversation', updateConversation);

chatRouter.post('/save-message', saveMessage);
chatRouter.get('/get-message/:conversationId', getMessage);

export default chatRouter;
