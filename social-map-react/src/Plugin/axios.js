import axiosLib from 'axios'
import Cookies from 'js-cookie'

const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

axios.defaults.withCredentials  = true 
axios.defaults.withXSRFToken = true;

axios.interceptors.request.use(async (config) => {
  if (config.method && config.method.toLowerCase() !== "get") {
    await axios.get("/csrf-cookie");
    const token = Cookies.get("XSRF-TOKEN");
    if (token) {
      config.headers["X-XSRF-TOKEN"] = token;
    }
  }

  return config;
});

export default axios
