export const routes = {
  login: () => '/login',
  dashboard: () => '/',
  habits: () => '/habits',
  habit: id => `/habits/${id}`,
  profile: () => '/profile',
  errorTest: () => '/error-test',
};
