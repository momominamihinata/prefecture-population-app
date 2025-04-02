import React from 'react';
import JapanMap from '../JapanMap';
import { Prefecture } from '@/types/prefecture';

interface PrefectureSelectorProps {
  prefectures: Prefecture[];
  loading: boolean;
  isPrefectureSelected: (prefCode: number) => boolean;
  onPrefectureClick: (prefCode: number, prefName: string) => void;
}

// 地方区分の定義
interface RegionData {
  id: string;
  name: string;
  prefectures: number[]; // prefCode の配列
}

// 地方区分情報
const regionData: RegionData[] = [
  {
    id: 'hokkaido',
    name: '北海道',
    prefectures: [1], // 北海道
  },
  {
    id: 'tohoku',
    name: '東北',
    prefectures: [2, 3, 4, 5, 6, 7], // 青森、岩手、宮城、秋田、山形、福島
  },
  {
    id: 'kanto',
    name: '関東',
    prefectures: [8, 9, 10, 11, 12, 13, 14], // 茨城、栃木、群馬、埼玉、千葉、東京、神奈川
  },
  {
    id: 'hokuriku-shinetsu',
    name: '北陸/信越',
    prefectures: [15, 16, 17, 18, 19, 20], // 新潟、富山、石川、福井、山梨、長野
  },
  {
    id: 'chubu',
    name: '中部',
    prefectures: [21, 22, 23], // 岐阜、静岡、愛知
  },
  {
    id: 'kinki',
    name: '近畿',
    prefectures: [24, 25, 26, 27, 28, 29, 30], // 三重、滋賀、京都、大阪、兵庫、奈良、和歌山
  },
  {
    id: 'chugoku',
    name: '中国',
    prefectures: [31, 32, 33, 34, 35], // 鳥取、島根、岡山、広島、山口
  },
  {
    id: 'shikoku',
    name: '四国',
    prefectures: [36, 37, 38, 39], // 徳島、香川、愛媛、高知
  },
  {
    id: 'kyushu-okinawa',
    name: '九州/沖縄',
    prefectures: [40, 41, 42, 43, 44, 45, 46, 47], // 福岡、佐賀、長崎、熊本、大分、宮崎、鹿児島、沖縄
  },
];

const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({
  prefectures,
  loading,
  isPrefectureSelected,
  onPrefectureClick,
}) => {
  // 地方ごとの都道府県をフィルタリングする関数
  const getPrefecturesByRegion = (regionId: string): Prefecture[] => {
    const region = regionData.find(r => r.id === regionId);
    if (!region) return [];
    
    return prefectures.filter(pref => region.prefectures.includes(pref.prefCode));
  };

  // 地方ブロックをレンダリングする関数
  const renderRegionBlock = (regionId: string, regionName: string, className?: string) => {
    const regionPrefectures = getPrefecturesByRegion(regionId);
    
    return (
      <div className={`bg-gray-100 p-4 rounded-lg w-full ${className || ''}`}>
        <h3 className="font-bold mb-2">{regionName}</h3>
        <div className="flex flex-wrap gap-2">
          {regionPrefectures.map((pref) => (
            <button
              key={pref.prefCode}
              onClick={() => onPrefectureClick(pref.prefCode, pref.prefName)}
              className={`px-3 py-1 rounded border xl:text-sm lg:text-[10px]  ${
                isPrefectureSelected(pref.prefCode)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white'
              }`}
              disabled={loading}
            >
              {pref.prefName}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">都道府県</h2>
      
      {/* スマホ表示用の地図とリスト */}
      <div className="md:hidden">
        <div className="mb-4 border rounded p-4 bg-white overflow-auto">
          <JapanMap
            onPrefectureClick={onPrefectureClick}
            isPrefectureSelected={isPrefectureSelected}
          />
        </div>
        <div className="space-y-4">
          {regionData.map(region => (
            <div key={region.id}>
              {renderRegionBlock(region.id, region.name)}
            </div>
          ))}
        </div>
      </div>
      
      {/* デスクトップ表示用のレイアウト */}
      <div className="hidden md:block relative h-[700px]">
        {/* 地図 */}
        <div className="absolute left-[51%] top-1/2 -translate-x-1/2 -translate-y-1/2  w-[130%] flex items-center justify-center z-0">
          <JapanMap
            onPrefectureClick={onPrefectureClick}
            isPrefectureSelected={isPrefectureSelected}
          />
        </div>
        {/* 北海道 */}
        <div className="absolute top-[60px] right-[50px] w-[10%]">
          {renderRegionBlock('hokkaido', '北海道')}
        </div>
        {/* 東北 */}
        <div className="absolute top-[180px] right-[50px] w-[25%]">
          {renderRegionBlock('tohoku', '東北')}
        </div>
        {/* 関東 */}
        <div className="absolute top-[340px] right-[50px] w-[25%]">
          {renderRegionBlock('kanto', '関東')}
        </div>
        {/* 北陸/信越 */}
        <div className="absolute top-0 left-[310px] w-[25%]">
          {renderRegionBlock('hokuriku-shinetsu', '北陸/信越')}
        </div>
        {/* 中部 */}
        <div className="absolute top-[570px] right-[100px] w-[17%]">
          {renderRegionBlock('chubu', '中部')}
        </div>
        {/* 近畿 */}
        <div className="absolute top-[160px] left-[80px] w-[30%]">
          {renderRegionBlock('kinki', '近畿')}
        </div>
        {/* 中国 */}
        <div className="absolute top-[320px] left-[10px] w-[17%]">
          {renderRegionBlock('chugoku', '中国')}
        </div>
        {/* 四国 */}
        <div className="absolute top-[570px] right-[320px] w-[17%]">
          {renderRegionBlock('shikoku', '四国')}
        </div>
        {/* 九州/沖縄 */}
        <div className="absolute top-[520px] left-[10px] w-[17%]">
          {renderRegionBlock('kyushu-okinawa', '九州/沖縄')}
        </div>
      </div>
    </div>
  );
};

export default PrefectureSelector;