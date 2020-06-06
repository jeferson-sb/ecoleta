import axios from 'axios';
import Config from 'react-native-config';

console.log(Config.API_URL);

const api = axios.create({
  baseURL: 'http://192.168.0.16:3333',
});

export default api;
