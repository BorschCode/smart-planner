import api from '../api/axios.js';


export async function profileLoader() {
  const res = await api.get('/api/user');
  return res.data.data;
}
