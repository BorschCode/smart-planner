import { CheckCircle, Calendar, Flame } from 'lucide-react';
import StatCard from './StatCard.jsx';

export default function DashboardCharts({ data }) {
  if (!data) return null;

  const todayPercent =
    data.today.total > 0 ? Math.round((data.today.completed / data.today.total) * 100) : 0;

  const weekPercent =
    data.week.total > 0 ? Math.round((data.week.completed / data.week.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Today */}
      <StatCard
        title="Today"
        icon={<CheckCircle className="text-green-600" />}
        value={`${data.today.completed} / ${data.today.total}`}
        progress={todayPercent}
        subtitle={`${todayPercent}% completed`}
      />

      {/* This week */}
      <StatCard
        title="This week"
        icon={<Calendar className="text-blue-600" />}
        value={`${data.week.completed} / ${data.week.total}`}
        progress={weekPercent}
        subtitle={`${weekPercent}% completed`}
      />

      {/* Streak */}
      <StatCard
        title="Current streak"
        icon={<Flame className="text-orange-600" />}
        value={`${data.streak} days`}
        progress={null}
        subtitle="Keep it going 🔥"
      />
    </div>
  );
}
