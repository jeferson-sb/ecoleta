import axios from 'axios';

let apiUrl;
if (process.env.NODE_ENV === 'production') {
  apiUrl = process.env.REACT_APP_API_URL;
} else {
  apiUrl = 'http://localhost:3333';
}

const api = axios.create({
  baseURL: apiUrl,
});

export default api;
