import backendApi from '../../utils/axios.js';

export const getCurrentUser = async () => {
  try {
    const { data } = await backendApi.get('/api/me');
    return data;
  } catch (error) {
    console.log('error :', error);
    return null;
  }
};
