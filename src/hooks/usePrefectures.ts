import { useState, useEffect } from 'react';
import { Prefecture } from '@/types/types';
import { fetchPrefectures } from '@/services/prefectureApi';

/**
 * 都道府県一覧を取得するカスタムフック
 * @returns 都道府県一覧、ローディング状態、エラー情報
 */
export const usePrefectures = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 都道府県一覧を取得
  useEffect(() => {
    const getPrefectures = async () => {
      try {
        setLoading(true);
        const response = await fetchPrefectures();
        setPrefectures(response.result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('都道府県データの取得に失敗しました'));
      } finally {
        setLoading(false);
      }
    };

    getPrefectures();
  }, []);

  return {
    prefectures,
    loading,
    error,
  };
};