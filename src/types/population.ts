/**
 * 人口種別を表す型
 */
export type PopulationType = 'total' | 'young' | 'working' | 'elderly';

/**
 * 1年分の人口データを表す型
 */
export interface PopulationData {
  year: number;
  value: number;
  rate?: number;
}

/**
 * 人口構成データを表す型
 */
export interface PopulationComposition {
  label: string;
  data: PopulationData[];
}

/**
 * 人口構成APIのレスポンス型
 */
export interface PopulationResponse {
  message: null | string;
  result: {
    boundaryYear: number;
    data: PopulationComposition[];
  };
}

/**
 * フロントエンド用に整形した人口データ型
 */
export interface FormattedPopulationData {
  prefCode: number;
  prefName: string;
  data: PopulationData[];
}