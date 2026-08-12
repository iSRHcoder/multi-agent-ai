import { useEffect } from 'react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import Nav from './Nav';
import { useDispatch, useSelector } from 'react-redux';
import getMessages from '../features/getMessages';
import sendMessage from '../features/sendMessage';
import { setMessages } from '../redux/messagesSlice';

const ChatArea = () => {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  useEffect(() => {
    let isCurrent = true;

    const getMessage = async () => {
      // Always clear messages when conversation changes
      dispatch(setMessages([]));

      // No selected conversation = new/empty chat
      if (!selectedConversation?._id) {
        return;
      }

      // New Chat should always start empty
      if (selectedConversation.title === 'New Chat') {
        return;
      }

      try {
        const data = await getMessages(selectedConversation._id);

        // Prevent an old API response from updating
        // the currently selected conversation
        if (isCurrent) {
          dispatch(setMessages(data));
        }
      } catch (error) {
        if (isCurrent) {
          console.error('Failed to get messages:', error);
        }
      }
    };

    getMessage();

    return () => {
      isCurrent = false;
    };
  }, [selectedConversation?._id, dispatch]);

  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
