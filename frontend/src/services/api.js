import axios from 'axios';

const API_ROOT = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const instance = axios.create({ baseURL: API_ROOT, withCredentials: false });

const setToken = (token)=>{
  if(token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
const clearToken = ()=>{ delete instance.defaults.headers.common['Authorization']; };

export default { get: instance.get, post: instance.post, put: instance.put, delete: instance.delete, setToken, clearToken };
