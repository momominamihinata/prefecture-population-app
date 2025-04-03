import React from 'react';
import JapanMap from './JapanMap';
import RegionBlock from './RegionBlock';
import { ViewProps } from '@/types/types';
import { REGION_POSITIONS } from '@/types/constants';

const DesktopView: React.FC<ViewProps> = ({
  regionData,
  loading,
  isPrefectureSelected,
  onPrefectureClick,
  getPrefecturesByRegion,
  hoveredPrefCode,
  onPrefectureHover
}) => {
  return (
    <div className="hidden lg:block relative h-[700px] mb-28">
      {/* 地図 */}
      <div className="absolute left-[51%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] flex items-center justify-center z-0">
        <JapanMap
          onPrefectureClick={onPrefectureClick}
          isPrefectureSelected={isPrefectureSelected}
          hoveredPrefCode={hoveredPrefCode}
          onPrefectureHover={onPrefectureHover}
        />
      </div>
      
      {/* 地方ブロック */}
      {REGION_POSITIONS.map(({ id, position }) => {
        const region = regionData.find(r => r.id === id);
        if (!region) return null;
        
        return (
          <div key={id} className={`absolute ${position}`}>
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
        );
      })}
    </div>
  );
};

export default DesktopView;