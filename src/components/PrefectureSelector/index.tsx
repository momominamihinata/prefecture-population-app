'use client';

import React, { useState } from 'react';
import { PrefectureSelectorProps } from '@/types/types';
import { REGION_DATA } from '@/types/constants';
import MobileView from './MobileView';
import DesktopView from './DesktopView';

const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({
  prefectures,
  loading,
  isPrefectureSelected,
  onPrefectureClick,
}) => {
  // 都道府県を地方ごとに分ける
  const getPrefecturesByRegion = (regionId: string) => {
    const region = REGION_DATA.find(r => r.id === regionId);
    if (!region) return [];
    
    return prefectures.filter(pref => region.prefectures.includes(pref.prefCode));
  };

  // ホバーしている都道府県のコードを管理
  const [hoveredPrefCode, setHoveredPrefCode] = useState<number | null>(null);

  // 都道府県にホバーするとこの関数が呼ばれる
  const handlePrefectureHover = (prefCode: number | null) => {
    setHoveredPrefCode(prefCode);
  };

  return (
    <div className="mb-8 w-full">
      <h2 className="text-xl font-light mb-4">都道府県を選択してください</h2>
      
      {/* SP表示 */}
      <MobileView
        prefectures={prefectures}
        regionData={REGION_DATA}
        loading={loading}
        isPrefectureSelected={isPrefectureSelected}
        onPrefectureClick={onPrefectureClick}
        getPrefecturesByRegion={getPrefecturesByRegion}
        hoveredPrefCode={hoveredPrefCode}
        onPrefectureHover={handlePrefectureHover}
      />
      
      {/* PC表示 */}
      <DesktopView
        prefectures={prefectures}
        loading={loading}
        isPrefectureSelected={isPrefectureSelected}
        onPrefectureClick={onPrefectureClick}
        getPrefecturesByRegion={getPrefecturesByRegion}
        hoveredPrefCode={hoveredPrefCode}
        onPrefectureHover={handlePrefectureHover}
      />
    </div>
  );
};

export default PrefectureSelector;