'use client';

import { useState } from 'react';
import { Target } from './types';
import Connection from './Connection';
import useTargets from './hooks/useTargets';
import TargetsList from './TargetsList/TargetsList';

export default function VoidSession() {
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);

  const { targets, loadingTargets, targetsError } = useTargets();

  if (loadingTargets) {
    return <p>Loading targets...</p>;
  }

  if (targetsError) {
    return <p>Error loading targets. Please try again later.</p>;
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto p-16">
      <h1 className="text-2xl font-bold">Void Session</h1>

      {selectedTarget ? (
        <Connection
          target={selectedTarget}
          onRelease={() => setSelectedTarget(null)}
        />
      ) : (
        <TargetsList targets={targets} onTargetFocus={setSelectedTarget} />
      )}
    </div>
  );
}
