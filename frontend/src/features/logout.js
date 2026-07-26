import backendApi from '../../utils/axios';

const logout = async () => {
  try {
    const { data } = await backendApi.get('/api/auth/logout');
    console.log('data', data);
  } catch (error) {
    console.log('logout error :', error);
  }
};

export default logout;
