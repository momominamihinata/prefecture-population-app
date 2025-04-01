import api from './api';

// 人口構成データを取得する
export const fetchPopulation = async (prefCode: number) => {
  try {
    const response = await api.get('/population/composition/perYear', {
      params: {
        prefCode,
        cityCode: '-',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`都道府県コード ${prefCode} の人口データ取得に失敗しました:`, error);
    throw error;
  }
};