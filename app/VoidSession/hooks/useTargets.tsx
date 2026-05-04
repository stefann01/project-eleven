import { useEffect, useState } from 'react';
import { Target } from '../types';
import { BASE_TARGETS_URL } from '@/app/constants';
import { mapTargets } from '../services/TargetService';

export default function useTargets() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loadingTargets, setLoadingTargets] = useState(true);
  const [targetsError, setTargetsError] = useState(null);

  useEffect(() => {
    fetch(BASE_TARGETS_URL)
      .then((response) => response.json())
      .then((data) => {
        setTargets(mapTargets(data));
        setLoadingTargets(false);
      })
      .catch((error) => {
        console.error('Error fetching targets:', error);
        setTargetsError(error);
        setLoadingTargets(false);
      });
  }, []);

  return { targets, loadingTargets, targetsError };
}
