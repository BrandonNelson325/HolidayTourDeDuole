import React from 'react';
import { Clock, Award, Mountain } from 'lucide-react';
import type { SortField } from '../utils/sortUtils';

interface SortControlsProps {
  currentSort: SortField;
  onSortChange: (field: SortField) => void;
}

export function SortControls({ currentSort, onSortChange }: SortControlsProps) {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      <div className="flex space-x-2">
        <button
          onClick={() => onSortChange('time')}
          className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            currentSort === 'time'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Clock className="h-4 w-4 mr-1" />
          Time
        </button>
        <button
          onClick={() => onSortChange('sprint')}
          className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            currentSort === 'sprint'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Award className="h-4 w-4 mr-1" />
          Sprint Points
        </button>
        <button
          onClick={() => onSortChange('kom')}
          className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            currentSort === 'kom'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Mountain className="h-4 w-4 mr-1" />
          KOM Points
        </button>
      </div>
    </div>
  );
}