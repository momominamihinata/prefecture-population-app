import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import PopulationChart from '../PopulationChart';
import { formatPopulationDataForChart } from '@/utils/populationDataFormatter';
import { POPULATION_TYPE_TITLES } from '@/types/constants';

// formatPopulationDataForChartをモック
jest.mock('@/utils/populationDataFormatter', () => ({
  formatPopulationDataForChart: jest.fn()
}));

// Rechartsのコンポーネントをモック
jest.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ dataKey }: { dataKey: string }) => <div data-testid={`line-${dataKey}`} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>
}));

describe('PopulationChart', () => {
  const mockPopulationData = [
    {
      prefCode: 1,
      prefName: '北海道',
      data: [
        { year: 2015, value: 5000000 },
        { year: 2020, value: 4900000 }
      ]
    },
    {
      prefCode: 2,
      prefName: '青森県',
      data: [
        { year: 2015, value: 1300000 },
        { year: 2020, value: 1250000 }
      ]
    }
  ];

  const mockChartData = [
    { year: 2015, '北海道': 5000000, '青森県': 1300000 },
    { year: 2020, '北海道': 4900000, '青森県': 1250000 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (formatPopulationDataForChart as jest.Mock).mockReturnValue(mockChartData);
  });

  it('グラフが正しくレンダリングされること', () => {
    render(
      <PopulationChart
        populationData={mockPopulationData}
        loading={false}
        populationType="total"
      />
    );
    
    // チャートタイトルが正しく表示されるか確認
    const chartTitle = POPULATION_TYPE_TITLES['total'];
    expect(screen.getByText(chartTitle)).toBeInTheDocument();
    
    // チャートのコンテナが存在するか確認
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    
    // 軸やグリッドが存在するか確認
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
    
    // 各都道府県のラインが存在するか確認
    mockPopulationData.forEach(pref => {
      expect(screen.getByTestId(`line-${pref.prefName}`)).toBeInTheDocument();
    });
    
    // formatPopulationDataForChartが正しく呼ばれたか確認
    expect(formatPopulationDataForChart).toHaveBeenCalledWith(mockPopulationData);
  });

  it('ローディング中は読み込み中メッセージが表示されること', () => {
    render(
      <PopulationChart
        populationData={mockPopulationData}
        loading={true}
        populationType="total"
      />
    );
    
    // ローディングメッセージが表示されるか確認
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    
    // グラフコンポーネントは表示されない
    expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
  });

  it('データが空の場合はガイドメッセージが表示されること', () => {
    render(
      <PopulationChart
        populationData={[]}
        loading={false}
        populationType="total"
      />
    );
    
    // ガイドメッセージが表示されるか確認
    expect(screen.getByText('都道府県を選択すると、人口推移グラフが表示されます')).toBeInTheDocument();
    
    // グラフコンポーネントは表示されない
    expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
  });

  it('人口種別によって正しいタイトルが表示されること', () => {
    // 年少人口の場合
    render(
      <PopulationChart
        populationData={mockPopulationData}
        loading={false}
        populationType="young"
      />
    );
    
    // 年少人口のタイトルが表示されるか確認
    const youngTitle = POPULATION_TYPE_TITLES['young'];
    expect(screen.getByText(youngTitle)).toBeInTheDocument();
    
    // 再レンダリングして老年人口の場合をテスト
    cleanup();
    render(
      <PopulationChart
        populationData={mockPopulationData}
        loading={false}
        populationType="elderly"
      />
    );
    
    // 老年人口のタイトルが表示されるか確認
    const elderlyTitle = POPULATION_TYPE_TITLES['elderly'];
    expect(screen.getByText(elderlyTitle)).toBeInTheDocument();
  });

  it('コンポーネントにpopulation-chartのIDが設定されていること', () => {
    render(
      <PopulationChart
        populationData={mockPopulationData}
        loading={false}
        populationType="total"
      />
    );
    
    // ID属性が正しく設定されているか確認
    const chartContainer = screen.getByText(POPULATION_TYPE_TITLES['total']).parentElement;
    expect(chartContainer).toHaveAttribute('id', 'population-chart');
  });
});