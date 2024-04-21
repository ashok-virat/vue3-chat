import axios from 'axios';

// Define your API base URL
const API_BASE_URL = 'https://dainty-maamoul-53e9d7.netlify.app/api/v1';

const ApiService = {
    // Example method to fetch user data
    async fetchUserData(userId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.message || error.message);
        }
    },

    // Example method to submit user data
    async submitUserData(userData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/signup`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.message || error.message);
        }
    },

    // Add more methods for other API endpoints as needed
};

export default ApiService;
