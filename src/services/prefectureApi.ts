import api from './api';

// 都道府県一覧を取得する
export const fetchPrefectures = async () => {
  try {
    const response = await api.get('/prefectures');
    return response.data;
  } catch (error) {
    console.error('都道府県一覧の取得に失敗しました:', error);
    throw error;
  }
};