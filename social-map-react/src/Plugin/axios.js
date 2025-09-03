import axiosLib from 'axios'

const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

export default axios
