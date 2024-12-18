import React, { useEffect } from 'react';
import { useRaceStore } from './stores/useRaceStore';
import { RacerList } from './components/RacerList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';

function EmbeddedStandings() {
  const { fetchRacers, isLoading, error } = useRaceStore();

  useEffect(() => {
    fetchRacers();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchRacers, 150000);
    return () => clearInterval(interval);
  }, [fetchRacers]);

  return (
    <div className="bg-transparent">
      {error ? (
        <ErrorAlert message={error} onRetry={fetchRacers} />
      ) : isLoading ? (
        <LoadingSpinner />
      ) : (
        <RacerList />
      )}
    </div>
  );
}

export default EmbeddedStandings;