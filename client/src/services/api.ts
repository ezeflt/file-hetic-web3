// src/services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export const registerUser = async (email: string, password: string) => {
    return api.post('/register', { user: email, password });
};

export const loginUser = async (email: string, password: string) => {
    return api.post('/login', { user: email, password });
};

export const uploadFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};

export const fetchFiles = async (token: string) => {
    return api.get('/files', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};

export const deleteFile = async (fileId: string, token: string) => {
    return api.delete(`/files/${fileId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};

export const shareFile = async (token: string) => {
    return api.get(`/share/${token}`, { responseType: 'blob' });
};
