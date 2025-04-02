import React from 'react';
import { RegionBlockProps } from './types';

const RegionBlock: React.FC<RegionBlockProps> = ({
  regionId,
  regionName,
  prefectures,
  loading,
  isPrefectureSelected,
  onPrefectureClick,
  className,
}) => {
  return (
    <div 
      className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-lg w-full ${className || ''}`}
      role="region" 
      aria-labelledby={`region-heading-${regionId}`}
    >
      <h3 
        id={`region-heading-${regionId}`} 
        className="font-bold mb-2 text-gray-800 dark:text-gray-200"
      >
        {regionName}
      </h3>
      <div className="flex flex-wrap gap-2" role="group" aria-label={`${regionName}の都道府県`}>
        {prefectures.map((pref) => (
          <button
            key={pref.prefCode}
            onClick={() => onPrefectureClick(pref.prefCode, pref.prefName)}
            className={`px-3 py-1 rounded border xl:text-sm lg:text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
              isPrefectureSelected(pref.prefCode)
                ? 'bg-blue-500 text-white dark:bg-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            disabled={loading}
            aria-pressed={isPrefectureSelected(pref.prefCode)}
            aria-label={`${pref.prefName}を${isPrefectureSelected(pref.prefCode) ? '選択解除' : '選択'}`}
          >
            {pref.prefName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegionBlock;