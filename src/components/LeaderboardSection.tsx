import React from 'react';
import { GenderLeaderboard } from './leaderboard/GenderLeaderboard';
import type { Database } from '../types/supabase';

type RacerStanding = Database['public']['Views']['racer_standings']['Row'];

interface LeaderboardSectionProps {
  racers: RacerStanding[];
}

export function LeaderboardSection({ racers }: LeaderboardSectionProps) {
  const maleRacers = racers.filter(r => r.gender === 'male');
  const femaleRacers = racers.filter(r => r.gender === 'female');

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <GenderLeaderboard
        title="Men's Leaders"
        racers={maleRacers}
        mountainTitle="King of the Mountains"
      />
      <GenderLeaderboard
        title="Women's Leaders"
        racers={femaleRacers}
        mountainTitle="Queen of the Mountains"
      />
    </div>
  );
}