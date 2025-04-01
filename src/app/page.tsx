'use client';

import { useState, useEffect } from 'react';
import { fetchPrefectures } from '@/services/prefectureApi';
import { fetchPopulation } from '@/services/populationApi';
import { Prefecture } from '@/types/prefecture';
import { PopulationResponse, PopulationComposition } from '@/types/population';

export default function Home() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [populationData, setPopulationData] = useState<PopulationResponse['result'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrefectures = async () => {
      try {
        setLoading(true);
        const data = await fetchPrefectures();
        setPrefectures(data.result);
        setLoading(false);
      } catch {
        // エラー変数を使わずにキャッチ
        setError('都道府県データの取得に失敗しました');
        setLoading(false);
      }
    };

    loadPrefectures();
  }, []);

  const handlePrefectureClick = async (prefCode: number) => {
    try {
      setLoading(true);
      const data = await fetchPopulation(prefCode);
      setPopulationData(data.result);
      setLoading(false);
    } catch {
      // エラー変数を使わずにキャッチ
      setError('人口データの取得に失敗しました');
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '20px' }}>
      <h1>都道府県別人口推移</h1>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      {loading ? (
        <div>読み込み中...</div>
      ) : (
        <div>
          <h2>都道府県一覧</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {prefectures.map((pref) => (
              <button 
                key={pref.prefCode}
                onClick={() => handlePrefectureClick(pref.prefCode)}
                style={{ margin: '5px', padding: '5px' }}
              >
                {pref.prefName}
              </button>
            ))}
          </div>
          
          {populationData && (
            <div style={{ marginTop: '20px' }}>
              <h2>人口データ</h2>
              <p>区切り年: {populationData.boundaryYear}</p>
              <ul>
                {populationData.data.map((item: PopulationComposition, index: number) => (
                  <li key={index}>
                    <strong>{item.label}</strong>
                    <ul>
                      {item.data.slice(0, 5).map((d, i) => (
                        <li key={i}>
                          {d.year}年: {d.value.toLocaleString()}人
                          {d.rate !== undefined && ` (${d.rate}%)`}
                        </li>
                      ))}
                      {item.data.length > 5 && <li>...</li>}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}