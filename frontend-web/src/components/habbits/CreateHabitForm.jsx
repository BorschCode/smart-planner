import api from '../../api/axios';
import HabitForm from './HabitForm';
import { routes } from '../../routes.js';

export default function CreateHabitForm({ onCreated, onCancel }) {
  return (
    <HabitForm
      onSubmit={async data => {
        await api.post(routes.habits(), data);
        onCreated();
      }}
      onCancel={onCancel}
    />
  );
}
