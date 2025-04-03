import api from './api';
import { PopulationResponse } from '@/types/types';

// 人口構成データを取得する
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
    throw error;
  }
};