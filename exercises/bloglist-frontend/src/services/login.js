import axios from "axios";
const baseUrl = "/api/login" || "http://localhost:3001/api/login";

const login = async (user) => {
    // try {
    const response = await axios.post(baseUrl, user);
    return response.data;
    // } catch (error) {
    //     console.log(error);
    // }
};

export default { login };
