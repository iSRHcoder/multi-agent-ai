import backendApi from '../../utils/axios.js';

export const updateConversation = async (payload) => {
  try {
    const { data } = await backendApi.post(
      '/chat/update-conversation',
      payload
    );

    return data;
  } catch (error) {
    console.error(
      'Update conversation error:',
      error.response?.data || error.message
    );

    throw error;
  }
};
