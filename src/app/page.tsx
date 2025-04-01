'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePrefectures } from '@/hooks/usePrefectures';
import { usePopulation } from '@/hooks/usePopulation';
import { useSelectedPrefectures } from '@/hooks/useSelectedPrefectures';
import { formatPopulationDataForChart } from '@/utils/populationDataFormatter';
import { PopulationType } from '@/types/population';

export default function Home() {
  // 都道府県一覧を取得するフック
  const { prefectures, loading: loadingPrefectures, error: prefectureError } = usePrefectures();
  
  // 人口データを取得・管理するフック
  const { 
    populationData, 
    populationType, 
    loading: loadingPopulation, 
    error: populationError,
    togglePrefecture, 
    changePopulationType 
  } = usePopulation();
  
  // 都道府県の選択状態を管理するフック
  const { isPrefectureSelected, togglePrefecture: toggleSelection } = useSelectedPrefectures();

  // 都道府県を選択したときの処理
  const handlePrefectureClick = async (prefCode: number, prefName: string) => {
    const newState = !isPrefectureSelected(prefCode);
    toggleSelection(prefCode, newState);
    await togglePrefecture(prefCode, prefName, newState);
  };

  // 人口種別を変更したときの処理
  const handlePopulationTypeChange = (type: PopulationType) => {
    changePopulationType(type);
  };

  // グラフ用のデータを整形
  const chartData = formatPopulationDataForChart(populationData);
  
  // エラーメッセージの統合
  const error = prefectureError?.message || populationError?.message || null;
  
  // ロード中かどうか
  const isLoading = loadingPrefectures || loadingPopulation;

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">都道府県別人口推移</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">都道府県</h2>
        <div className="flex flex-wrap gap-2">
          {loadingPrefectures ? (
            <div>都道府県データを読み込み中...</div>
          ) : (
            prefectures.map((pref) => (
              <button 
                key={pref.prefCode}
                onClick={() => handlePrefectureClick(pref.prefCode, pref.prefName)}
                className={`px-3 py-1 rounded border ${
                  isPrefectureSelected(pref.prefCode)
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
      
      {/* 人口種別切り替えボタン */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">人口種別</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePopulationTypeChange('total')}
            className={`px-3 py-1 rounded border ${
              populationType === 'total' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            disabled={isLoading}
          >
            総人口
          </button>
          <button
            onClick={() => handlePopulationTypeChange('young')}
            className={`px-3 py-1 rounded border ${
              populationType === 'young' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            disabled={isLoading}
          >
            年少人口
          </button>
          <button
            onClick={() => handlePopulationTypeChange('working')}
            className={`px-3 py-1 rounded border ${
              populationType === 'working' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            disabled={isLoading}
          >
            生産年齢人口
          </button>
          <button
            onClick={() => handlePopulationTypeChange('elderly')}
            className={`px-3 py-1 rounded border ${
              populationType === 'elderly' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            disabled={isLoading}
          >
            老年人口
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">人口推移グラフ</h2>
        {loadingPopulation ? (
          <div className="border border-gray-200 rounded p-8 text-center">
            読み込み中...
          </div>
        ) : populationData.length > 0 ? (
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
                {populationData.map((pref, index) => (
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