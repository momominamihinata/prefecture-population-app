import React from 'react';
import { Prefecture } from '@/types/prefecture';
import { PrefectureSelectorProps } from './types';
import { REGION_DATA } from './constants';
import MobileView from './MobileView';
import DesktopView from './DesktopView';

const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({
  prefectures,
  loading,
  isPrefectureSelected,
  onPrefectureClick,
}) => {
  // 地方ごとの都道府県をフィルタリングする関数
  const getPrefecturesByRegion = (regionId: string): Prefecture[] => {
    const region = REGION_DATA.find(r => r.id === regionId);
    if (!region) return [];
    
    return prefectures.filter(pref => region.prefectures.includes(pref.prefCode));
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">都道府県</h2>
      
      {/* SP表示 */}
      <MobileView
        prefectures={prefectures}
        regionData={REGION_DATA}
        loading={loading}
        isPrefectureSelected={isPrefectureSelected}
        onPrefectureClick={onPrefectureClick}
        getPrefecturesByRegion={getPrefecturesByRegion}
      />
      
      {/* PC表示 */}
      <DesktopView
        prefectures={prefectures}
        loading={loading}
        isPrefectureSelected={isPrefectureSelected}
        onPrefectureClick={onPrefectureClick}
        getPrefecturesByRegion={getPrefecturesByRegion}
      />
    </div>
  );
};

export default PrefectureSelector;