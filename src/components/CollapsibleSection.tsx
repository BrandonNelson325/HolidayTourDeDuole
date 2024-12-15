import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleSection({ title, children, defaultExpanded = false }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <button
        className="w-full px-4 py-5 sm:p-6 flex items-center justify-between text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}