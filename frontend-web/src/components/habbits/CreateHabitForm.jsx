import api from '../../api/axios';
import HabitForm from './HabitForm';

export default function CreateHabitForm({ onCreated, onCancel }) {
  return (
    <HabitForm
      onSubmit={async data => {
        await api.post('/api/habits', data);
        onCreated();
      }}
      onCancel={onCancel}
    />
  );
}
