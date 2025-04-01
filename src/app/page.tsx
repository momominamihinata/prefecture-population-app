'use client';

import { usePrefectures } from '@/hooks/usePrefectures';
import { usePopulation } from '@/hooks/usePopulation';
import { useSelectedPrefectures } from '@/hooks/useSelectedPrefectures';
import PrefectureSelector from '@/components/PrefectureSelector';
import PopulationTypeSelector from '@/components/PopulationTypeSelector';
import PopulationChart from '@/components/PopulationChart';
import { PopulationType } from '@/types/population';

export default function Home() {
  // 都道府県一覧を取得するフック
  const { prefectures, loading: loadingPrefectures, error: prefectureError } = usePrefectures();

  // 人口データを取得・管理するフック
  const {
    populationData,
    populationType,
    loading: loadingPopulation,
    error: populationError,
    togglePrefecture,
    changePopulationType,
  } = usePopulation();

  // 都道府県の選択状態を管理するフック
  const { isPrefectureSelected, togglePrefecture: toggleSelection } =
    useSelectedPrefectures();

  // 都道府県を選択したときの処理
  const handlePrefectureClick = async (prefCode: number, prefName: string) => {
    const newState = !isPrefectureSelected(prefCode);
    toggleSelection(prefCode, newState);
    await togglePrefecture(prefCode, prefName, newState);
  };

  // 人口種別を変更したときの処理
  const handlePopulationTypeChange = (type: PopulationType) => {
    changePopulationType(type);
  };

  // エラーメッセージの統合
  const error = prefectureError?.message || populationError?.message || null;

  // ロード中かどうか
  const isLoading = loadingPrefectures || loadingPopulation;

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">都道府県別人口推移</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <PrefectureSelector
        prefectures={prefectures}
        loading={loadingPrefectures}
        isPrefectureSelected={isPrefectureSelected}
        onPrefectureClick={handlePrefectureClick}
      />

      <PopulationTypeSelector
        populationType={populationType}
        onPopulationTypeChange={handlePopulationTypeChange}
        loading={isLoading}
      />

      <PopulationChart
        populationData={populationData}
        loading={loadingPopulation}
      />
    </main>
  );
}