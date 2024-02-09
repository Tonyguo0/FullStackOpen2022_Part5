import axios from "axios";
const baseUrl = "/api/persons";

const getAllPeople = () => {
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
};

const addPerson = (newPerson) => {
    const request = axios.post(baseUrl, newPerson);
    return request.then((response) => response.data);
};

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
    // return request.then((response) => response.data);
};

const updatePerson = (id, newPerson) => {
    const request = axios.put(`${baseUrl}/${id}`, newPerson);
    return request.then((response) => response.data);
};

const exportObjects = { getAllPeople, addPerson, deletePerson, updatePerson };

export default exportObjects;
