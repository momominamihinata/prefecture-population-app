import api from './api';
import { PopulationResponse } from '@/types/population';

/**
 * 人口構成データを取得する
 * @param prefCode 都道府県コード
 */
export const fetchPopulation = async (prefCode: number): Promise<PopulationResponse> => {
  try {
    const response = await api.get<PopulationResponse>('/population/composition/perYear', {
      params: {
        prefCode,
        cityCode: '-',
      },
    });
    return response.data;
  } catch (error) {
    // console.error(`都道府県コード ${prefCode} の人口データ取得に失敗しました:`, error);
    throw error;
  }
};