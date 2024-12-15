import React, { useEffect } from 'react';
import { useRaceStore } from './stores/useRaceStore';
import { AppLayout } from './components/layout/AppLayout';
import { Header } from './components/layout/Header';
import { AdminSection } from './components/sections/AdminSection';
import { CollapsibleSection } from './components/CollapsibleSection';
import { RacerList } from './components/RacerList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';

function App() {
  const { racers, isLoading, error, fetchRacers } = useRaceStore();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    fetchRacers();
  }, [fetchRacers]);

  if (error) {
    return <ErrorAlert message={error} onRetry={fetchRacers} />;
  }

  return (
    <AppLayout>
      <Header isAuthenticated={isAuthenticated} onLogin={setIsAuthenticated} />
      
      {isLoading && <LoadingSpinner />}

      <div className="space-y-8">
        {isAuthenticated && (
          <AdminSection hasRacers={racers.length > 0} />
        )}

        {racers.length > 0 && (
          <CollapsibleSection title="Overall Standings" defaultExpanded={true}>
            <RacerList />
          </CollapsibleSection>
        )}
      </div>
    </AppLayout>
  );
}

export default App;