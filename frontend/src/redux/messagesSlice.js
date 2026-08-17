import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'message',

  initialState: {
    messages: [],
    isMessagesLoading: false,
    isAiResponding: false,
  },

  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessagesLoading: (state, action) => {
      state.isMessagesLoading = action.payload;
    },

    setAiResponding: (state, action) => {
      state.isAiResponding = action.payload;
    },
  },
});

export const { setMessages, addMessage, setMessagesLoading, setAiResponding } =
  messageSlice.actions;

export default messageSlice.reducer;
