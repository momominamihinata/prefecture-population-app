'use client';

import { useState } from 'react';
import { PopulationTypeSelectorProps } from '@/types/types';
import PopulationChart from '@/components/PopulationTypeSelector/PopulationChart';
import { POPULATION_TABS } from '@/types/constants';

const PopulationTypeSelector: React.FC<PopulationTypeSelectorProps> = ({
  populationType,
  onPopulationTypeChange,
  loading,
  populationData,
  loadingPopulation,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // 現在選択されている種別のラベルを取得
  const currentTypeLabel = POPULATION_TABS.find(tab => tab.type === populationType)?.label || '';

  return (
    <div>
      <div className="border-b-4 border-gray-200">
        <h3 className="text-lg font-semibold mb-4">人口推移グラフ</h3>
        
        {/* スマホ表示用ドロップダウン */}
        <div className="sm:hidden relative mb-4">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={loading}
            className={`
              w-full flex items-center justify-between py-3 px-4 
              bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md 
              shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span>{currentTypeLabel}</span>
            <span className={`inline-block w-4 h-4 ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>

          {dropdownOpen && (
            <div 
              className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700"
              role="listbox"
            >
              {POPULATION_TABS.map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => {
                    onPopulationTypeChange(type);
                    setDropdownOpen(false);
                  }}
                  className={`
                    w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700
                    ${populationType === type 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300'}
                  `}
                  role="option"
                  aria-selected={populationType === type}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* タブレット・PC表示用タブ */}
        <nav className="hidden sm:flex -mb-1" aria-label="人口種別タブ">
          {POPULATION_TABS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onPopulationTypeChange(type)}
              className={`
                whitespace-nowrap py-3 px-4 border-b-4 md:text-sm lg:text-lg font-medium transition-colors
                ${populationType === type 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-gray-200 dark:hover:bg-gray-800' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'}
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