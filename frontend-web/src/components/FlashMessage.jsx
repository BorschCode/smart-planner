export default function FlashMessage({ message }) {
  if (!message) return null;

  const styles = {
    success: 'bg-green-50 text-green-700 border border-green-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <div className={`p-4 rounded-xl text-sm font-medium ${styles[message.type]}`}>
      {message.text}
    </div>
  );
}
