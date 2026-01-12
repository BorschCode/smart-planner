import { useLoaderData, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import HabitForm from './HabitForm';

export default function HabitEditForm() {
  const habit = useLoaderData();
  const navigate = useNavigate();

  return (
    <HabitForm
      initial={habit}
      onSubmit={async data => {
        await api.put(`/api/habits/${habit.id}`, data);
        navigate(`/habits/${habit.id}`);
      }}
    />
  );
}
