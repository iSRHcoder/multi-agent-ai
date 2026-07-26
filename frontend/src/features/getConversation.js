import backendApi from '../../utils/axios.js';

export const getConversations = async () => {
  try {
    const { data } = await backendApi.get('/api/chat/get-conversations');
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
