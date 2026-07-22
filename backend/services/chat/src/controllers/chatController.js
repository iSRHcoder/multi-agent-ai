import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    console.log('userId:', userId);

    const conversation = await Conversation.create({
      userId: userId,
    });

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({
      message: `Create conversation error : ${error}`,
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    console.log('userId', userId);
    const conversations = await Conversation.find({
      userId: userId,
    }).sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({
      message: `get conversations error : ${error}`,
    });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { id, title } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(id, { title });

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({
      message: `Update conversations error : ${error}`,
    });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content } = req.body;

    if (!conversationId || !role || !content)
      return res.status(404).json({ message: 'No conversationId or role or content' });

    const message = await Message.create({
      conversationId,
      content,
      role,
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({
      message: `Save message error : ${error}`,
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    if (!conversationId) return res.status(404).json({ message: 'No conversationId' });

    const message = await Message.create({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: -1 });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({
      message: `get message error : ${error}`,
    });
  }
};
