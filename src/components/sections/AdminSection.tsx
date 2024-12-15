import React from 'react';
import { RacerForm } from '../RacerForm';
import { DailyResultsTable } from '../DailyResultsTable';
import { CollapsibleSection } from '../CollapsibleSection';

interface AdminSectionProps {
  hasRacers: boolean;
}

export function AdminSection({ hasRacers }: AdminSectionProps) {
  return (
    <>
      <CollapsibleSection title="Add New Racer">
        <RacerForm />
      </CollapsibleSection>

      {hasRacers && (
        <CollapsibleSection title="Daily Results Entry">
          <DailyResultsTable />
        </CollapsibleSection>
      )}
    </>
  );
}