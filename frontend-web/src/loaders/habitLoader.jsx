import api from '../api/axios';

export async function habitLoader({ params }) {
  const res = await api.get(`/api/habits/${params.id}`);
  return res.data.data;
}
