import React from 'react';
import backendApi from '../../utils/axios';

const sendMessage = async (payload) => {
  try {
    const { data } = await backendApi.post('/api/agent/chat', payload);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default sendMessage;
