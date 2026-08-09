import { useEffect } from 'react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import Nav from './Nav';
import { useDispatch, useSelector } from 'react-redux';
import getMessages from '../features/getMessages';
import sendMessage from '../features/sendMessage';
import setMessages from '../redux/messagesSlice';

const ChatArea = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMessage = async () => {
      if (!selectedConversation) return;

      try {
        const data = await getMessages(selectedConversation._id);

        console.log('message data', data);

        dispatch(setMessages(data));
      } catch (error) {
        console.error('Failed to get messages:', error);
      }
    };
    getMessage();
  }, [selectedConversation]);

  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
