import { Prefecture } from '@/types/prefecture';

export interface PrefectureSelectorProps {
  prefectures: Prefecture[];
  loading: boolean;
  isPrefectureSelected: (prefCode: number) => boolean;
  onPrefectureClick: (prefCode: number, prefName: string) => void;
}

export interface RegionData {
  id: string;
  name: string;
  prefectures: number[];
}

export interface RegionPosition {
  id: string;
  position: string;
}

export interface RegionBlockProps {
  regionId: string;
  regionName: string;
  prefectures: Prefecture[];
  loading: boolean;
  isPrefectureSelected: (prefCode: number) => boolean;
  onPrefectureClick: (prefCode: number, prefName: string) => void;
  className?: string;
}

export interface MobileViewProps {
  prefectures: Prefecture[];
  regionData: RegionData[];
  loading: boolean;
  isPrefectureSelected: (prefCode: number) => boolean;
  onPrefectureClick: (prefCode: number, prefName: string) => void;
  getPrefecturesByRegion: (regionId: string) => Prefecture[];
}

export interface DesktopViewProps {
  prefectures: Prefecture[];
  loading: boolean;
  isPrefectureSelected: (prefCode: number) => boolean;
  onPrefectureClick: (prefCode: number, prefName: string) => void;
  getPrefecturesByRegion: (regionId: string) => Prefecture[];
}