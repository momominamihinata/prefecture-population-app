import { 
  PopulationData, 
  PopulationType, 
  FormattedPopulationData,
  PopulationComposition
} from '../types/types';
import { POPULATION_TYPE_LABELS } from '../types/constants';

/**
 * APIから取得した人口データから特定の種別のデータを取得する
 * @param populationData APIから取得した人口データ
 * @param type 人口種別
 * @returns 指定した種別の人口データ
 */
export const extractPopulationDataByType = (
  populationData: { data: PopulationComposition[] },
  type: PopulationType
): PopulationData[] => {
  const label = POPULATION_TYPE_LABELS[type];
  const found = populationData.data.find((item) => item.label === label);
  
  if (!found) {
    throw new Error(`人口種別「${label}」のデータが見つかりません`);
  }
  
  return found.data;
};

/**
 * 都道府県ごとのデータをグラフ表示用に整形する関数
 * 
 * @returns
 * 返すデータは以下が集まった配列
 * {
 *  year: 1960,
 *  "東京都": 9683802,
 *  "大阪府": 5504746
 *　}
 *
 * @param populationDataList 「複数の」都道府県の人口データ
 */
export const formatPopulationDataForChart = (
  populationDataList: FormattedPopulationData[]
): { year: number; [prefName: string]: number }[] => {
  if (populationDataList.length === 0) return [];

  // すべての年のセットを作成
  const yearsSet = new Set<number>();
  populationDataList.forEach((prefecture) => {
    prefecture.data.forEach((item) => {
      yearsSet.add(item.year);
    });
  });

  // 年順にソートした配列を取得
  const years = Array.from(yearsSet).sort((a, b) => a - b);

  // 各年のデータポイントを作成
  return years.map((year) => {
    // 基本となる年のデータポイント
    const dataPoint: { year: number; [prefName: string]: number } = { year };

    // 各都道府県のデータを追加
    populationDataList.forEach((prefecture) => {
      const yearData = prefecture.data.find((d) => d.year === year);
      if (yearData) {
        dataPoint[prefecture.prefName] = yearData.value;
      }
    });

    return dataPoint;
  });
};

/**
 * 人口データのリストから特定の都道府県のデータを削除する（チェックボックス外した時）
 * @param populationDataList 人口データリスト
 * @param prefCode 削除する都道府県コード
 */
export const removePopulationData = (
  populationDataList: FormattedPopulationData[],
  prefCode: number
): FormattedPopulationData[] => {
  return populationDataList.filter((data) => data.prefCode !== prefCode);
};