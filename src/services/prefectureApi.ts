import api from './api';
import { PrefectureResponse } from '@/types/types';

// 都道府県一覧を取得する
export const fetchPrefectures = async (): Promise<PrefectureResponse> => {
  try {
    const response = await api.get<PrefectureResponse>('/prefectures');
    return response.data;
  } catch (error) {
    throw error;
  }
};