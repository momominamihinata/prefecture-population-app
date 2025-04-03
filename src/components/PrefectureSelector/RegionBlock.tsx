import React from 'react';
import { RegionBlockProps } from '@/types/types';

const RegionBlock: React.FC<RegionBlockProps> = ({
  regionId,
  regionName,
  prefectures,
  loading,
  isPrefectureSelected,
  onPrefectureClick,
  hoveredPrefCode,
  onPrefectureHover,
  className,
}) => {
  return (
    <div 
      className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-lg lg:w-full max-lg:h-full mx-2 ${className || ''}`}
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
        {prefectures.map((pref) => {
          const isSelected = isPrefectureSelected(pref.prefCode);
          const isHovered = hoveredPrefCode === pref.prefCode;
          
          // 選択状態とホバー状態に基づいてスタイルのクラスを決定
          let buttonClasses = "px-3 py-1 rounded border xl:text-sm lg:text-[10px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ";
          
          if (isSelected) {
            buttonClasses += "bg-blue-500 text-white dark:bg-blue-600";
          } else if (isHovered) {
            buttonClasses += "bg-blue-200 dark:bg-blue-400 text-gray-800 dark:text-white";
          } else {
            buttonClasses += "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600";
          }
          
          return (
            <button
              key={pref.prefCode}
              onClick={() => onPrefectureClick(pref.prefCode, pref.prefName)}
              className={buttonClasses}
              disabled={loading}
              aria-pressed={isSelected}
              aria-label={`${pref.prefName}を${isSelected ? '選択解除' : '選択'}`}
              onMouseEnter={() => onPrefectureHover && onPrefectureHover(pref.prefCode)}
              onMouseLeave={() => onPrefectureHover && onPrefectureHover(null)}
            >
              {pref.prefName}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RegionBlock;