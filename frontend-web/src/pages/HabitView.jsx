import { useLoaderData, useLocation } from 'react-router-dom';
import HabitEditForm from '../components/habbits/HabitEditForm.jsx';
import HabitDetails from '../components/habbits/HabitDetails.jsx';

export default function HabitView() {
  const habit = useLoaderData();
  const location = useLocation();
  const edit = location.state?.edit === true;

  if (edit) {
    return <HabitEditForm habit={habit} />;
  }

  return <HabitDetails habit={habit} />;
}
