import { useLoaderData } from 'react-router-dom';

export default function Profile() {
  const profile = useLoaderData();
  console.log(profile);
  return <h1>User profile</h1>;
}
