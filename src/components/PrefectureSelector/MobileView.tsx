import React from 'react';
import RegionBlock from './RegionBlock';
import { ViewProps } from '@/types/types';

const MobileView: React.FC<ViewProps> = ({
  regionData,
  loading,
  isPrefectureSelected,
  onPrefectureClick,
  getPrefecturesByRegion,
  hoveredPrefCode,
  onPrefectureHover
}) => {
  return (
    <div className="lg:hidden" role="region" aria-label="都道府県選択（モバイル表示）">
      <div className="space-y-4 grid md:grid-cols-2">
        {regionData.map(region => (
          <div key={region.id}>
            <RegionBlock
              regionId={region.id}
              regionName={region.name}
              prefectures={getPrefecturesByRegion(region.id)}
              loading={loading}
              isPrefectureSelected={isPrefectureSelected}
              onPrefectureClick={onPrefectureClick}
              hoveredPrefCode={hoveredPrefCode}
              onPrefectureHover={onPrefectureHover}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileView;