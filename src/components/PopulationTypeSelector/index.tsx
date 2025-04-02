'use client';

import { PopulationType } from '@/types/population';
import PopulationChart from '@/components/PopulationTypeSelector/PopulationChart';
import { FormattedPopulationData } from '@/types/population';

interface PopulationTypeSelectorProps {
  populationType: PopulationType;
  onPopulationTypeChange: (type: PopulationType) => void;
  loading: boolean;
  populationData: FormattedPopulationData[];
  loadingPopulation: boolean;
}

const PopulationTypeSelector: React.FC<PopulationTypeSelectorProps> = ({
  populationType,
  onPopulationTypeChange,
  loading,
  populationData,
  loadingPopulation,
}) => {
  const tabs: Array<{ type: PopulationType; label: string }> = [
    { type: 'total', label: '総人口' },
    { type: 'young', label: '年少人口' },
    { type: 'working', label: '生産年齢人口' },
    { type: 'elderly', label: '老年人口' }
  ];

  return (
    <div> 
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-1" aria-label="人口種別タブ">
          {tabs.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onPopulationTypeChange(type)}
              className={`
                whitespace-nowrap py-3 px-4 border-b-2 text-sm font-medium transition-colors
                ${populationType === type 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={loading}
              role="tab"
              aria-selected={populationType === type}
              aria-controls={`tabpanel-${type}`}
              id={`tab-${type}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
      <div 
        role="tabpanel" 
        id={`tabpanel-${populationType}`}
        aria-labelledby={`tab-${populationType}`}
        className="mt-4 py-2"
      >
        {/* タブコンテンツとしてPopulationChartを配置 */}
        <PopulationChart
          populationData={populationData}
          loading={loadingPopulation}
          populationType={populationType}
        />
      </div>
    </div>
  );
};

export default PopulationTypeSelector;