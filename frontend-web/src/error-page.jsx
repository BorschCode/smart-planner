import { useRouteError, Link } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-red-50 border border-red-200 rounded-lg p-6">
      <h1 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h1>

      <p className="text-red-600 mb-4">
        {error?.statusText || error?.message || 'Unexpected error'}
      </p>

      <Link
        to="/"
        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Go Home
      </Link>
    </div>
  );
}
