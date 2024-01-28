import axios from "axios";
const baseUrl = "/api/blogs" || "http://localhost:3001/api/blogs";

const getAll = async () => {
    const request = axios.get(baseUrl);
    const response = await request;
    return response.data;
};

export default { getAll };
