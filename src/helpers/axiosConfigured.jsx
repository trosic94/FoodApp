import axios from 'axios';
import {getJWT} from './'


const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    mode: 'cors'
});

axiosInstance.interceptors.request.use(function (config) {
      config.headers['x-access-token'] =  getJWT();
  
      return config;
  });
export default axiosInstance;