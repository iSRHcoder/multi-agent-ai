import backendApi from '../../utils/axios.js';

export const createConversation = async () => {
  try {
    const { data } = await backendApi.get('/api/chat/create-conversation');
    console.log('data:', data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
