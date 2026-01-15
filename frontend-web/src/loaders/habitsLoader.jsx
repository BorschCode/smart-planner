import api from '../api/axios.js';
import { routes } from '../routes.js';

export async function habitsLoader() {
  const res = await api.get(routes.habits());
  return res.data.data;
}
