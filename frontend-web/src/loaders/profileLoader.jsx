import api from '../api/axios.js';
import { routes } from '../routes.js';


export async function profileLoader() {
  const res = await api.get(routes.user());
  return res.data;
}
