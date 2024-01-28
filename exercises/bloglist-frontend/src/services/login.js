import axios from "axios";
const baseUrl = "/api/login" || "http://localhost:3001/api/login";

const login = async (user) => {
    const response = await axios.post(baseUrl, user);
    return response.data;
};

export default { login };
