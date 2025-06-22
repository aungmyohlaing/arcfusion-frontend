import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Message, ChatHistory, ChatSessionState } from '../types/common';


const initialState: ChatSessionState = {
  chatId: localStorage.getItem('chatId') || '',
  chatHistory: {
    chat_id: '',
    messages: [],
    message_count: 0,
  },
  isLoading: false,
};

export const chatSessionSlice = createSlice({
    name: 'chatSession',
    initialState,
    reducers: {
        setChatId: (state, action: PayloadAction<string>) => {
            state.chatId = action.payload;       
            localStorage.setItem('chatId', action.payload);
        },
        clearChatId: (state) => {
            state.chatId = '';
            localStorage.removeItem('chatId');
            state.chatHistory.messages = [];
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            state.chatHistory.messages.push(action.payload);
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setChatHistory: (state, action: PayloadAction<ChatHistory>) => {
            state.chatHistory = action.payload;
        },
    },
});

export const { setChatId, clearChatId, addMessage, setIsLoading, setChatHistory } = chatSessionSlice.actions;

export default chatSessionSlice.reducer;