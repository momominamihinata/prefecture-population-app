import React from 'react';
import JapanMap from './JapanMap';
import RegionBlock from './RegionBlock';
import { DesktopViewProps } from './types';
import { REGION_DATA, REGION_POSITIONS } from './constants';

const DesktopView: React.FC<DesktopViewProps> = ({
  loading,
  isPrefectureSelected,
  onPrefectureClick,
  getPrefecturesByRegion,
}) => {
  return (
    <div className="hidden md:block relative h-[700px]">
      {/* 地図 */}
      <div className="absolute left-[51%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] flex items-center justify-center z-0">
        <JapanMap
          onPrefectureClick={onPrefectureClick}
          isPrefectureSelected={isPrefectureSelected}
        />
      </div>
      
      {/* 地方ブロック */}
      {REGION_POSITIONS.map(({ id, position }) => {
        const region = REGION_DATA.find(r => r.id === id);
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
            />
          </div>
        );
      })}
    </div>
  );
};

export default DesktopView;