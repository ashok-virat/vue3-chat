import axios from 'axios';

// Define your API base URL
const API_BASE_URL = 'https://dainty-maamoul-53e9d7.netlify.app/api/v1';

const ApiService = {
    async submitUserData(userData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/signup`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data || error.message);
        }
    },

    async login(userData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, userData);
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error(error.response.data || error.message);
        }
    },

    async fetchUsers() {
        try {
            const response = await axios.get(`${API_BASE_URL}/getusers`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.message || error.message);
        }
    },


    async fetchMessages(req) {
        try {
            const response = await axios.post(`${API_BASE_URL}/getMessages`, req);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.message || error.message);
        }
    },

    async createMessage(req) {
        try {
            const response = await axios.post(`${API_BASE_URL}/createMessage`, req);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.message || error.message);
        }
    },
};

export default ApiService;
