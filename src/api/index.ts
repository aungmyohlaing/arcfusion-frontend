import client from './client';

export const apiClient = {
  getUploadedFiles: async () => {
    try {
      const response = await client.get('/api/files');
      return response.data;
    } catch (error) {
      console.error('Error getting uploaded files:', error);
      throw error;
    }
  },

  uploadFiles: async (files: File[]) => {
    try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
      const response = await client.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },

  startChat: async () => {
    try {
      const response = await client.post('/api/chat/create');
      return response.data;
    } catch (error) {
      console.error('Error starting chat:', error);
      throw error;
    }
  },

  getChatHistory: async (chatId: string) => {
    try {
      const response = await client.get(`/api/chat/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting chat:', error);
      throw error;
    }
  },
  
  resetChat: async () => {
    try {
      const response = await client.post(`/api/reset`);      
      return response.data;
      
    } catch (error) {
      console.error('Error resetting chat:', error);
      throw error;
    }
  },
  
  getAllChats: async () => {
    try {
      const response = await client.get(`/api/chat`);      
      return response.data;      
    } catch (error) {
      console.error('Error getting all chats:', error);
      throw error;
    }
  }

};