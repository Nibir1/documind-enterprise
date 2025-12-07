import axios from 'axios';

// Vite proxies /api to the backend, so we just use the relative path
export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Upload requires 'multipart/form-data'
export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const sendChatMessage = async (message: string) => {
  const response = await apiClient.post('/chat/', { message });
  return response.data;
};