import React from 'react';
import { Clock, Award, Mountain } from 'lucide-react';
import { CategoryLeaders } from './CategoryLeaders';
import { millisecondsToTime } from '../../utils/timeUtils';
import type { Database } from '../../types/supabase';

type RacerStanding = Database['public']['Views']['racer_standings']['Row'];

interface GenderLeaderboardProps {
  title: string;
  racers: RacerStanding[];
  mountainTitle: string;
}

export function GenderLeaderboard({ title, racers, mountainTitle }: GenderLeaderboardProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <CategoryLeaders
          title="General Classification"
          icon={Clock}
          racers={racers}
          getValue={r => r.total_time}
          formatValue={millisecondsToTime}
          sortDirection="asc"
        />
        <CategoryLeaders
          title="Sprint Competition"
          icon={Award}
          racers={racers}
          getValue={r => r.total_sprint_points}
        />
        <CategoryLeaders
          title={mountainTitle}
          icon={Mountain}
          racers={racers}
          getValue={r => r.total_kom_points}
        />
      </div>
    </div>
  );
}