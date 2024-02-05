import axios from "axios";
const baseUrl = "http://localhost:3001/api/blogs" || "/api/blogs";

let token = null;

const setToken = async (newToken) => {
    token = `Bearer ${newToken}`;
};

const getAll = async () => {
    const request = axios.get(baseUrl);
    const response = await request;
    return response.data;
};

const createBlog = async (newBlog) => {
    try {
        const config = {
            headers: { Authorization: token }
        };
        const response = await axios.post(baseUrl, newBlog, config);
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export default { setToken, getAll, createBlog };
