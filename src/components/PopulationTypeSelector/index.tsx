'use client';

import { PopulationType } from '@/types/population';

interface PopulationTypeSelectorProps {
  populationType: PopulationType;
  onPopulationTypeChange: (type: PopulationType) => void;
  loading: boolean;
}

const PopulationTypeSelector: React.FC<PopulationTypeSelectorProps> = ({
  populationType,
  onPopulationTypeChange,
  loading,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">人口種別</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onPopulationTypeChange('total')}
          className={`px-3 py-1 rounded border ${
            populationType === 'total' ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
          disabled={loading}
        >
          総人口
        </button>
        <button
          onClick={() => onPopulationTypeChange('young')}
          className={`px-3 py-1 rounded border ${
            populationType === 'young' ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
          disabled={loading}
        >
          年少人口
        </button>
        <button
          onClick={() => onPopulationTypeChange('working')}
          className={`px-3 py-1 rounded border ${
            populationType === 'working' ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
          disabled={loading}
        >
          生産年齢人口
        </button>
        <button
          onClick={() => onPopulationTypeChange('elderly')}
          className={`px-3 py-1 rounded border ${
            populationType === 'elderly' ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
          disabled={loading}
        >
          老年人口
        </button>
      </div>
    </div>
  );
};

export default PopulationTypeSelector;