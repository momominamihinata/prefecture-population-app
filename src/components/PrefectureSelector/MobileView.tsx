import React from 'react';
import JapanMap from './JapanMap';
import RegionBlock from './RegionBlock';
import { MobileViewProps } from './types';

const MobileView: React.FC<MobileViewProps> = ({
  regionData,
  loading,
  isPrefectureSelected,
  onPrefectureClick,
  getPrefecturesByRegion,
}) => {
  return (
    <div className="md:hidden" role="region" aria-label="都道府県選択（モバイル表示）">
      <div className="mb-4 border dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800 overflow-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 z-10">
            <span className="sr-only">読み込み中...</span>
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
        <JapanMap
          onPrefectureClick={onPrefectureClick}
          isPrefectureSelected={isPrefectureSelected}
        />
      </div>
      <div className="space-y-4">
        {regionData.map(region => (
          <div key={region.id}>
            <RegionBlock
              regionId={region.id}
              regionName={region.name}
              prefectures={getPrefecturesByRegion(region.id)}
              loading={loading}
              isPrefectureSelected={isPrefectureSelected}
              onPrefectureClick={onPrefectureClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileView;