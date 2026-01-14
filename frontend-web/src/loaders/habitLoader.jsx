import api from '../api/axios';
import { routes } from '../routes.js';

export async function habitLoader({ params }) {
  const res = await api.get(routes.habit(params.id));
  return res.data.data;
}
