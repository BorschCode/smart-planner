export const routes = {
  login: () => '/login',
  logout: () => '/logout',
  dashboard: () => '/',
  habits: () => '/api/habits',
  habit: id => `/api/habits/${id}`,
  habitComplete: id => `/api/habits/${id}/complete`,
  profile: () => '/profile',
  user: () => '/api/user',
  errorTest: () => '/error-test',
};
