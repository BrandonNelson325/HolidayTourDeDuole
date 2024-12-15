import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useRaceStore } from '../stores/useRaceStore';

export function RacerForm() {
  const [name, setName] = useState('');
  const { addRacer, isLoading } = useRaceStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await addRacer(name);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Racer Name
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter racer name"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Racer
          </button>
        </div>
      </div>
    </form>
  );
}