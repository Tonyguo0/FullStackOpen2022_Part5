import axios from "axios";
const baseUrl = "/api/blogs" || "http://localhost:3001/api/blogs";

let token = null;

const setToken = async (token) => {
    token = `Bearer ${token}`;
};

const getAll = async () => {
    const request = axios.get(baseUrl);
    const response = await request;
    return response.data;
};

const createBlog = async (blog) => {
    const config = {
        Headers: { Authorisation: token }
    };
    const response = await axios.post(baseUrl, blog, config);
    return response;
};

export default { setToken, getAll, createBlog };
