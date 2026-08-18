import backendApi from '../../utils/axios.js';

export const createConversation = async () => {
  try {
    const { data } = await backendApi.get('/chat/create-conversation');

    return data;
  } catch (error) {
    console.error(
      'Create conversation error:',
      error.response?.data || error.message
    );

    throw error;
  }
};
