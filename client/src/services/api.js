import axios from "axios";
const API = axios.create({
  baseURL: "https://authentication-express-rz1w.onrender.com",
  withCredentials: true,
});


export default API;
