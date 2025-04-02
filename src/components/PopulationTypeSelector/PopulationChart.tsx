'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormattedPopulationData, PopulationType } from '@/types/population';
import { formatPopulationDataForChart } from '@/utils/populationDataFormatter';

interface PopulationChartProps {
  populationData: FormattedPopulationData[];
  loading: boolean;
  populationType: PopulationType;
}

const PopulationChart: React.FC<PopulationChartProps> = ({
  populationData,
  loading,
  populationType,
}) => {
  const chartData = formatPopulationDataForChart(populationData);
  
  // 人口種別に応じたタイトルを設定
  const getChartTitle = (): string => {
    switch (populationType) {
      case 'total':
        return '総人口推移';
      case 'young':
        return '年少人口推移（0〜14歳）';
      case 'working':
        return '生産年齢人口推移（15〜64歳）';
      case 'elderly':
        return '老年人口推移（65歳以上）';
      default:
        return '人口推移';
    }
  };

  // コンテナのスタイル - どの状態でも同じ高さと幅を保つ
  const containerStyle = "h-96 w-full border border-gray-200 rounded p-4";

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{getChartTitle()}</h3>
      <div className={containerStyle}>
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : populationData.length > 0 ? (
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
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">都道府県を選択すると、人口推移グラフが表示されます</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopulationChart;