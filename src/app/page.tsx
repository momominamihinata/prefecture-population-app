'use client';

import { usePrefectures } from '@/hooks/usePrefectures';
import { usePopulation } from '@/hooks/usePopulation';
import { useSelectedPrefectures } from '@/hooks/useSelectedPrefectures';
import PrefectureSelector from '@/components/PrefectureSelector';
import PopulationTypeSelector from '@/components/PopulationTypeSelector';
import { PopulationType } from '@/types/population';
import { useState } from 'react';

export default function Home() {
  // 都道府県一覧を取得するフック
  const { prefectures, loading: loadingPrefectures, error: prefectureError } = usePrefectures();

  // 人口データを取得・管理するフック
  const {
    populationData,
    populationType,
    loading: loadingPopulation,
    error: populationError,
    togglePrefecture: togglePopulationData,
    changePopulationType,
  } = usePopulation();

  // 都道府県の選択状態を管理するフック
  const { isPrefectureSelected, togglePrefecture: toggleSelection } =
    useSelectedPrefectures();

  // 操作中フラグ - 処理中の重複クリックを防止
  const [isProcessing, setIsProcessing] = useState(false);

  // 都道府県を選択したときの処理
  const handlePrefectureClick = async (prefCode: number, prefName: string) => {
    // 処理中なら何もしない
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      const newState = !isPrefectureSelected(prefCode);
      
      // 表示状態のみ即時更新（UIの応答性向上）
      toggleSelection(prefCode, newState);
      
      // データ取得と更新（非同期）
      await togglePopulationData(prefCode, prefName, newState);
    } finally {
      setIsProcessing(false);
    }
  };

  // 人口種別を変更したときの処理
  const handlePopulationTypeChange = (type: PopulationType) => {
    if (isProcessing) return;
    changePopulationType(type);
  };

  // エラーメッセージの統合
  const error = prefectureError?.message || populationError?.message || null;

  // ロード中かどうか
  const isLoading = loadingPrefectures || loadingPopulation || isProcessing;

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">都道府県別人口推移</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <PrefectureSelector
        prefectures={prefectures}
        loading={isLoading}
        isPrefectureSelected={isPrefectureSelected}
        onPrefectureClick={handlePrefectureClick}
      />

      <PopulationTypeSelector
        populationType={populationType}
        onPopulationTypeChange={handlePopulationTypeChange}
        loading={isLoading}
        populationData={populationData}
        loadingPopulation={loadingPopulation}
      />
    </main>
  );
}