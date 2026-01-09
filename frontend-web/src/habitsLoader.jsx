import api from './api/axios.js';


export async function habitsLoader() {
  const res = await api.get('/api/habits');
  return res.data.data;
}
