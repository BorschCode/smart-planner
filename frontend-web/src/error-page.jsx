import { useRouteError, Link } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-4">Oops 😵</h1>
      <p className="mb-4">{error.statusText || error.message || 'Something went wrong'}</p>
      <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Go Home
      </Link>
    </div>
  );
}
