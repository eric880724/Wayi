// app/components/FilterTabs.tsx - Create filter tabs component
'use client';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="mb-4 border-b">
      <div className="flex space-x-1">
        <button
          className={`py-2 px-4 font-medium ${activeFilter === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => onFilterChange('all')}
        >
          全部
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeFilter === 'uncompleted' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => onFilterChange('uncompleted')}
        >
          未完成
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeFilter === 'completed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => onFilterChange('completed')}
        >
          已完成
        </button>
      </div>
    </div>
  );
}