// 都道府県一覧APIのレスポンス型
export interface PrefectureResponse {
  message: null | string;
  result: Prefecture[];
}

// 人口構成APIのレスポンス型
export interface PopulationResponse {
  message: null | string;
  result: {
    boundaryYear: number;
    data: PopulationComposition[];
  };
}

// 人口種別を表す型
export type PopulationType = 'total' | 'young' | 'working' | 'elderly';

// 1年分の人口データを表す型
export interface PopulationData {
  year: number;
  value: number;
  rate?: number;
}

// 人口構成データを表す型
export interface PopulationComposition {
  label: string;
  data: PopulationData[];
}

// フロントエンド用に整形した人口データ型
export interface FormattedPopulationData {
  prefCode: number;
  prefName: string;
  data: PopulationData[];
}

// 都道府県の情報を表す型
export interface Prefecture {
  prefCode: number;
  prefName: string;
}

// 地方区分情報
export interface RegionData {
  id: string;
  name: string;
  prefectures: number[];
}

// 地方位置情報
export interface RegionPosition {
  id: string;
  position: string;
}


// PopulationTypeSelector
export interface PopulationTypeSelectorProps {
  populationType: PopulationType;
  onPopulationTypeChange: (type: PopulationType) => void;
  loading: boolean;
  populationData: FormattedPopulationData[];
  loadingPopulation: boolean;
}

// PopulationChart
export interface PopulationChartProps {
  populationData: FormattedPopulationData[];
  loading: boolean;
  populationType: PopulationType;
}

// JapanMapPropsの更新
export interface JapanMapProps {
  onPrefectureClick: (prefCode: number, prefName: string) => void;
  isPrefectureSelected: (prefCode: number) => boolean;
  hoveredPrefCode?: number | null;
  onPrefectureHover?: (prefCode: number | null) => void;
}

// RegionBlockPropsの更新
export interface RegionBlockProps {
  regionId: string;
  regionName: string;
  prefectures: Prefecture[];
  loading: boolean;
  isPrefectureSelected: (prefCode: number) => boolean;
  onPrefectureClick: (prefCode: number, prefName: string) => void;
  hoveredPrefCode?: number | null;
  onPrefectureHover?: (prefCode: number | null) => void;
  className?: string;
}

// ViewPropsの更新
export interface ViewProps {
  prefectures: Prefecture[];
  regionData: RegionData[];
  loading: boolean;
  isPrefectureSelected: (prefCode: number) => boolean;
  onPrefectureClick: (prefCode: number, prefName: string) => void;
  getPrefecturesByRegion: (regionId: string) => Prefecture[];
  hoveredPrefCode?: number | null;
  onPrefectureHover?: (prefCode: number | null) => void;
}

// PrefectureSelectorPropsの更新
export interface PrefectureSelectorProps {
  prefectures: Prefecture[];
  loading: boolean;
  isPrefectureSelected: (prefCode: number) => boolean;
  onPrefectureClick: (prefCode: number, prefName: string) => void;
}