import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';
import { usePrefectures } from '@/hooks/usePrefectures';
import { usePopulation } from '@/hooks/usePopulation';
import { useSelectedPrefectures } from '@/hooks/useSelectedPrefectures';

// モックの作成
jest.mock('@/hooks/usePrefectures');
jest.mock('@/hooks/usePopulation');
jest.mock('@/hooks/useSelectedPrefectures');

// コンポーネントのモック
jest.mock('@/components/PrefectureSelector', () => {
  return function MockPrefectureSelector(props: { loading: boolean; onPrefectureClick: (prefCode: number, prefName: string) => void }) {
    return (
      <div 
        data-testid="prefecture-selector"
        data-loading={props.loading ? 'true' : 'false'}
      >
        <button
          data-testid="test-prefecture-button"
          onClick={() => props.onPrefectureClick(1, '北海道')}
        >
          北海道
        </button>
      </div>
    );
  };
});

jest.mock('@/components/PopulationTypeSelector', () => {
  return function MockPopulationTypeSelector(props: { onPopulationTypeChange: (type: string) => void }) {
    return (
      <div data-testid="population-type-selector">
        <button
          data-testid="test-type-button"
          onClick={() => props.onPopulationTypeChange('young')}
        >
          年少人口
        </button>
      </div>
    );
  };
});

jest.mock('@/components/ScrollToChartButton', () => {
  return function MockScrollToChartButton() {
    return <div data-testid="scroll-to-chart-button" />;
  };
});

describe('Home Page', () => {
  // デフォルトのモック戻り値を設定
  const mockPrefectures = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 13, prefName: '東京都' }
  ];
  
  const mockPopulationData = [{
    prefCode: 1,
    prefName: '北海道',
    data: [{ year: 2015, value: 5000000 }]
  }];

  let mockToggleSelection: jest.Mock;
  let mockTogglePopulationData: jest.Mock;
  let mockChangePopulationType: jest.Mock;

  beforeEach(() => {
    mockToggleSelection = jest.fn();
    mockTogglePopulationData = jest.fn().mockResolvedValue(undefined);
    mockChangePopulationType = jest.fn();

    // usePrefecturesのモック実装
    (usePrefectures as jest.Mock).mockReturnValue({
      prefectures: mockPrefectures,
      loading: false,
      error: null
    });
    
    // usePopulationのモック実装
    (usePopulation as jest.Mock).mockReturnValue({
      populationData: mockPopulationData,
      populationType: 'total',
      loading: false,
      error: null,
      togglePrefecture: mockTogglePopulationData,
      changePopulationType: mockChangePopulationType
    });
    
    // useSelectedPrefecturesのモック実装
    (useSelectedPrefectures as jest.Mock).mockReturnValue({
      isPrefectureSelected: jest.fn().mockImplementation(prefCode => prefCode === 1),
      togglePrefecture: mockToggleSelection
    });
    
    jest.clearAllMocks();
  });

  it('ホームページが正しくレンダリングされること', () => {
    render(<Home />);
    
    // タイトルが表示されているか確認
    expect(screen.getByText('都道府県別人口推移')).toBeInTheDocument();
    
    // 各コンポーネントがレンダリングされているか確認
    expect(screen.getByTestId('prefecture-selector')).toBeInTheDocument();
    expect(screen.getByTestId('population-type-selector')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-to-chart-button')).toBeInTheDocument();
  });

  it('都道府県選択時に適切な関数が呼ばれること', async () => {
    // 未選択状態のモックを設定
    (useSelectedPrefectures as jest.Mock).mockReturnValue({
      isPrefectureSelected: jest.fn().mockReturnValue(false),
      togglePrefecture: mockToggleSelection
    });
    
    render(<Home />);
    
    // 北海道ボタンをクリック
    fireEvent.click(screen.getByTestId('test-prefecture-button'));
    
    // 選択状態の更新関数が呼ばれたか確認
    expect(mockToggleSelection).toHaveBeenCalledWith(1, true);
    
    // 人口データ取得関数が呼ばれたか確認
    await waitFor(() => {
      expect(mockTogglePopulationData).toHaveBeenCalledWith(1, '北海道', true);
    });
  });

  it('人口種別変更時に適切な関数が呼ばれること', () => {
    render(<Home />);
    
    // 年少人口ボタンをクリック
    fireEvent.click(screen.getByTestId('test-type-button'));
    
    // 人口種別変更関数が呼ばれたか確認
    expect(mockChangePopulationType).toHaveBeenCalledWith('young');
  });

  it('エラーがある場合はエラーメッセージが表示されること', () => {
    // 都道府県データ取得エラーの場合
    (usePrefectures as jest.Mock).mockReturnValue({
      prefectures: [],
      loading: false,
      error: new Error('都道府県データの取得に失敗しました')
    });
    
    render(<Home />);
    
    // エラーメッセージが表示されているか確認
    expect(screen.getByText('都道府県データの取得に失敗しました')).toBeInTheDocument();
    
    // 人口データ取得エラーの場合に再レンダリング
    (usePrefectures as jest.Mock).mockReturnValue({
      prefectures: mockPrefectures,
      loading: false,
      error: null
    });
    
    (usePopulation as jest.Mock).mockReturnValue({
      populationData: [],
      populationType: 'total',
      loading: false,
      error: new Error('人口データの取得に失敗しました'),
      togglePrefecture: mockTogglePopulationData,
      changePopulationType: mockChangePopulationType
    });
    
    // 再レンダリング
    const { unmount } = render(<Home />);
    unmount();
    render(<Home />);
    
    // エラーメッセージが表示されているか確認
    expect(screen.getByText('人口データの取得に失敗しました')).toBeInTheDocument();
  });

  it('読み込み中の状態が正しく子コンポーネントに伝わること', () => {
    // 都道府県データ読み込み中
    (usePrefectures as jest.Mock).mockReturnValue({
      prefectures: [],
      loading: true,
      error: null
    });
    
    const { rerender } = render(<Home />);
    
    // PrefectureSelectorのloading属性を確認
    const prefectureSelector = screen.getByTestId('prefecture-selector');
    expect(prefectureSelector).toHaveAttribute('data-loading', 'true');
    
    // 人口データ読み込み中
    (usePrefectures as jest.Mock).mockReturnValue({
      prefectures: mockPrefectures,
      loading: false,
      error: null
    });
    
    (usePopulation as jest.Mock).mockReturnValue({
      populationData: [],
      populationType: 'total',
      loading: true,
      error: null,
      togglePrefecture: mockTogglePopulationData,
      changePopulationType: mockChangePopulationType
    });
    
    // 再レンダリング
    rerender(<Home />);
    
    // loadingがtrueで渡されているか確認
    expect(screen.getByTestId('prefecture-selector')).toHaveAttribute('data-loading', 'true');
  });
});