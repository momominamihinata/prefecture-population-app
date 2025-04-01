'use client';

import { Prefecture } from '@/types/prefecture';

interface PrefectureSelectorProps {
  prefectures: Prefecture[];
  loading: boolean;
  isPrefectureSelected: (prefCode: number) => boolean;
  onPrefectureClick: (prefCode: number, prefName: string) => void;
}

const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({
  prefectures,
  loading,
  isPrefectureSelected,
  onPrefectureClick,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">都道府県</h2>
      <div className="flex flex-wrap gap-2">
        {loading ? (
          <div>都道府県データを読み込み中...</div>
        ) : (
          prefectures.map((pref) => (
            <button
              key={pref.prefCode}
              onClick={() => onPrefectureClick(pref.prefCode, pref.prefName)}
              className={`px-3 py-1 rounded border ${
                isPrefectureSelected(pref.prefCode)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white'
              }`}
            >
              {pref.prefName}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default PrefectureSelector;