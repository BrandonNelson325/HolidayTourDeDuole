import React, { useState } from 'react';
import { Clock, Award, Mountain } from 'lucide-react';

interface DailyResultFormProps {
  racerId: string;
  day: number;
  onSubmit: (data: { time: number; sprintPoints: number; komPoints: number }) => void;
}

export function DailyResultForm({ racerId, day, onSubmit }: DailyResultFormProps) {
  const [time, setTime] = useState('');
  const [sprintPoints, setSprintPoints] = useState('');
  const [komPoints, setKomPoints] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      time: parseFloat(time),
      sprintPoints: parseInt(sprintPoints),
      komPoints: parseInt(komPoints),
    });
    setTime('');
    setSprintPoints('');
    setKomPoints('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">Day {day} Results</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Time (minutes)
            </div>
          </label>
          <input
            type="number"
            step="0.01"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Sprint Points
            </div>
          </label>
          <input
            type="number"
            value={sprintPoints}
            onChange={(e) => setSprintPoints(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Mountain className="h-4 w-4 mr-2" />
              KOM Points
            </div>
          </label>
          <input
            type="number"
            value={komPoints}
            onChange={(e) => setKomPoints(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit Results
      </button>
    </form>
  );
}