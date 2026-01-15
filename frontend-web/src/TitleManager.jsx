import { useMatches } from 'react-router-dom';
import { useEffect } from 'react';

export default function TitleManager() {
  const matches = useMatches();

  useEffect(() => {
    const title = [...matches].reverse().find(m => m.handle?.title)?.handle.title;

    if (title) {
      document.title = `Smart Planner – ${title}`;
    }
  }, [matches]);

  return null;
}
