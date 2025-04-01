import api from './api';
import { PrefectureResponse } from '@/types/prefecture';

/**
 * 都道府県一覧を取得する
 */
export const fetchPrefectures = async (): Promise<PrefectureResponse> => {
  try {
    const response = await api.get<PrefectureResponse>('/prefectures');
    return response.data;
  } catch (error) {
    // console.error('都道府県一覧の取得に失敗しました:', error);
    throw error;
  }
};