export const codingAgent = async (state) => {
  console.log('hello from coding agent', state);

  return {
    ...state,
    aiResponse: 'Coding agent response',
  };
};
