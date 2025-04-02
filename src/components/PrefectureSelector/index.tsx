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
  const renderRegionBlock = (regionId: string, regionName: string) => {
    const regionPrefectures = getPrefecturesByRegion(regionId);
    
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">{regionName}</h3>
        <div className="flex flex-wrap gap-2">
          {regionPrefectures.map((pref) => (
            <button
              key={pref.prefCode}
              onClick={() => onPrefectureClick(pref.prefCode, pref.prefName)}
              className={`px-3 py-1 rounded border text-sm ${
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
      
      {/* スマホ表示用の地図 */}
      <div className="md:hidden mb-4">
        <div className="border rounded p-4 bg-white overflow-auto">
          <JapanMap
            onPrefectureClick={onPrefectureClick}
            isPrefectureSelected={isPrefectureSelected}
          />
        </div>
      </div>
      
      {/* 地図と地方ブロックのフリーレイアウト */}
      <div className="hidden md:block">
        <div className="relative map-layout">
          {/* 地図 */}
          <div className="map-center">
            <JapanMap
              onPrefectureClick={onPrefectureClick}
              isPrefectureSelected={isPrefectureSelected}
            />
          </div>
          
          {/* 北海道 */}
          <div className="region hokkaido-region">
            {renderRegionBlock('hokkaido', '北海道')}
          </div>
          
          {/* 東北 */}
          <div className="region tohoku-region">
            {renderRegionBlock('tohoku', '東北')}
          </div>
          
          {/* 関東 */}
          <div className="region kanto-region">
            {renderRegionBlock('kanto', '関東')}
          </div>
          
          {/* 北陸/信越 */}
          <div className="region hokuriku-region">
            {renderRegionBlock('hokuriku-shinetsu', '北陸/信越')}
          </div>
          
          {/* 中部 */}
          <div className="region chubu-region">
            {renderRegionBlock('chubu', '中部')}
          </div>
          
          {/* 近畿 */}
          <div className="region kinki-region">
            {renderRegionBlock('kinki', '近畿')}
          </div>
          
          {/* 中国 */}
          <div className="region chugoku-region">
            {renderRegionBlock('chugoku', '中国')}
          </div>
          
          {/* 四国 */}
          <div className="region shikoku-region">
            {renderRegionBlock('shikoku', '四国')}
          </div>
          
          {/* 九州/沖縄 */}
          <div className="region kyushu-region">
            {renderRegionBlock('kyushu-okinawa', '九州/沖縄')}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .map-layout {
          height: 700px;
          position: relative;
        }
        
        .map-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 1500px;
          height: 1500px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0;
        }
        
        .region {
          position: absolute;
          width: 250px;
        }
        
        .hokkaido-region {
          top: 40px;
          right: 80px;
        }
        
        .tohoku-region {
          top: 250px;
          right: 90px;
        }
        
        .kanto-region {
          top: 470px;
          right: 100px;
        }
        
        .hokuriku-region {
          top: 40px;
          left: 80px;
        }
        
        .kinki-region {
          top: 250px;
          left: 80px;
        }
        
        .chugoku-region {
          top: 470px;
          left: 80px;
        }
        
        .kyushu-region {
          top: 700px;
          left: 250px;
        }
        
        .shikoku-region {
          top: 700px;
          left: 550px;
        }
        
        .chubu-region {
          top: 700px;
          right: 100px;
        }
        
        @media (max-width: 1280px) {
          .map-center {
            width: 500px;
            height: 500px;
          }
          
          .region {
            width: 220px;
          }
        }
      `}</style>
      
      {/* スマホ表示用の地方ブロック */}
      <div className="md:hidden">
        <div className="space-y-4">
          {regionData.map(region => (
            <div key={region.id}>
              {renderRegionBlock(region.id, region.name)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrefectureSelector;