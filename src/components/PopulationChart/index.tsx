'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormattedPopulationData } from '@/types/population';
import { formatPopulationDataForChart } from '@/utils/populationDataFormatter';

interface PopulationChartProps {
  populationData: FormattedPopulationData[];
  loading: boolean;
}

const PopulationChart: React.FC<PopulationChartProps> = ({
  populationData,
  loading,
}) => {
  const chartData = formatPopulationDataForChart(populationData);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">人口推移グラフ</h2>
      {loading ? (
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
  );
};

export default PopulationChart;