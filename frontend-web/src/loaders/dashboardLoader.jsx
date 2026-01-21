import api from '../api/axios.js';
import { routes } from '../routes.js';

export async function dashboardLoader() {
  const [habitsRes, chartsRes] = await Promise.all([
    api.get(routes.dashboardHabits()),
    api.get(routes.dashboardCharts()),
  ]);

  return {
    habits: habitsRes.data,
    charts: chartsRes.data,
  };
}
