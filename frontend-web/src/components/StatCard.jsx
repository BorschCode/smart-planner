export default function StatCard({ title, icon, value, subtitle, progress }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{title}</span>
        {icon}
      </div>

      <div className="text-2xl font-bold text-gray-900">{value}</div>

      {progress !== null && (
        <div className="space-y-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      )}

      {progress === null && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}

