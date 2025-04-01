import { useState } from 'react';
import { fetchPopulation } from '@/services/populationApi';
import { 
  PopulationType, 
  FormattedPopulationData 
} from '@/types/population';
import { 
  extractPopulationDataByType, 
  removePopulationData
} from '@/utils/populationDataFormatter';

/**
 * 人口データを取得・管理するカスタムフック
 * @returns 人口データの状態と操作関数
 */
export const usePopulation = () => {
  // 選択した都道府県の人口データ
  const [populationData, setPopulationData] = useState<FormattedPopulationData[]>([]);
  // 選択中の人口種別
  const [populationType, setPopulationType] = useState<PopulationType>('total');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 都道府県の選択状態を切り替える
   * @param prefCode 都道府県コード
   * @param prefName 都道府県名
   * @param selected 選択状態（trueで選択、falseで選択解除）
   */
  const togglePrefecture = async (
    prefCode: number, 
    prefName: string, 
    selected: boolean
  ) => {
    // 選択が解除されたとき
    if (!selected) {
      setPopulationData(removePopulationData(populationData, prefCode));
      return;
    }

    // 新たに選択された場合は人口データを取得
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchPopulation(prefCode);
      const populationByType = extractPopulationDataByType(
        response.result, 
        populationType
      );

      // 新しい都道府県データを追加
      setPopulationData(prev => [
        ...prev,
        {
          prefCode,
          prefName,
          data: populationByType
        }
      ]);
    } catch (err) {
      setError(err instanceof Error 
        ? err 
        : new Error(`都道府県コード ${prefCode} の人口データ取得に失敗しました`)
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * 人口種別を変更する
   * @param type 新しい人口種別
   */
  const changePopulationType = async (type: PopulationType) => {
    setLoading(true);
    setError(null);
    setPopulationType(type);

    try {
      // すべての選択中都道府県のデータを新しい種別で再取得
      const updatedData = await Promise.all(
        populationData.map(async ({ prefCode, prefName }) => {
          const response = await fetchPopulation(prefCode);
          const populationByType = extractPopulationDataByType(
            response.result, 
            type
          );
          
          return {
            prefCode,
            prefName,
            data: populationByType
          };
        })
      );

      setPopulationData(updatedData);
    } catch (err) {
      setError(err instanceof Error 
        ? err 
        : new Error('人口データの更新に失敗しました')
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    populationData,      // 選択した都道府県の人口データ
    populationType,      // 選択中の人口種別
    loading,
    error,
    togglePrefecture,    // 都道府県選択・解除
    changePopulationType // 人口種別変更
  };
};