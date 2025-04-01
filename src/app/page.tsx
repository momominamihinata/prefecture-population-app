'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchPrefectures } from '@/services/prefectureApi';
import { fetchPopulation } from '@/services/populationApi';
import { Prefecture } from '@/types/prefecture';
import { PopulationResponse, PopulationComposition, FormattedPopulationData } from '@/types/population';
import { formatPopulationDataForChart, extractPopulationDataByType } from '@/utils/populationDataFormatter';

export default function Home() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<FormattedPopulationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 都道府県一覧を取得
  useEffect(() => {
    const loadPrefectures = async () => {
      try {
        setLoading(true);
        const data = await fetchPrefectures();
        setPrefectures(data.result);
        setLoading(false);
      } catch {
        setError('都道府県データの取得に失敗しました');
        setLoading(false);
      }
    };

    loadPrefectures();
  }, []);

  // 都道府県を選択したときの処理
  const handlePrefectureClick = async (prefCode: number, prefName: string) => {
    try {
      setLoading(true);
      
      // 既に選択されている場合は選択解除
      const isSelected = selectedPrefectures.some(pref => pref.prefCode === prefCode);
      if (isSelected) {
        setSelectedPrefectures(selectedPrefectures.filter(pref => pref.prefCode !== prefCode));
        setLoading(false);
        return;
      }
      
      // 人口データを取得
      const response = await fetchPopulation(prefCode);
      
      // 総人口データを抽出
      const totalPopulation = extractPopulationDataByType(response.result, 'total');
      
      // 新しい都道府県データを追加
      setSelectedPrefectures([
        ...selectedPrefectures,
        {
          prefCode,
          prefName,
          data: totalPopulation
        }
      ]);
      
      setLoading(false);
    } catch {
      setError('人口データの取得に失敗しました');
      setLoading(false);
    }
  };

  // グラフ用のデータを整形
  const chartData = formatPopulationDataForChart(selectedPrefectures);

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">都道府県別人口推移</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">都道府県</h2>
        <div className="flex flex-wrap gap-2">
          {loading && prefectures.length === 0 ? (
            <div>都道府県データを読み込み中...</div>
          ) : (
            prefectures.map((pref) => (
              <button 
                key={pref.prefCode}
                onClick={() => handlePrefectureClick(pref.prefCode, pref.prefName)}
                className={`px-3 py-1 rounded border ${
                  selectedPrefectures.some(p => p.prefCode === pref.prefCode)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white'
                }`}
              >
                {pref.prefName}
              </button>
            ))
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">人口推移グラフ</h2>
        {loading && selectedPrefectures.length === 0 ? (
          <div>読み込み中...</div>
        ) : selectedPrefectures.length > 0 ? (
          <div className="h-96 w-full border border-gray-200 rounded p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  label={{ value: '年度', position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  label={{ value: '人口数', angle: -90, position: 'insideLeft', offset: -5 }} 
                  tickFormatter={(value) => (value / 10000).toFixed(0) + '万人'}
                />
                <Tooltip 
                  formatter={(value) => Number(value).toLocaleString() + '人'} 
                  labelFormatter={(label) => `${label}年`}
                />
                <Legend />
                {selectedPrefectures.map((pref, index) => (
                  <Line
                    key={pref.prefCode}
                    type="monotone"
                    dataKey={pref.prefName}
                    stroke={`hsl(${index * 30}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="border border-gray-200 rounded p-8 text-center text-gray-500">
            都道府県を選択すると、人口推移グラフが表示されます
          </div>
        )}
      </div>
    </main>
  );
}