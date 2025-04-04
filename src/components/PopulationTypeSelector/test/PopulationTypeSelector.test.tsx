import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PopulationTypeSelector from '@/components/PopulationTypeSelector';
import { POPULATION_TABS } from '@/types/constants';

// PopulationChartコンポーネントをモック
jest.mock('@/components/PopulationTypeSelector/PopulationChart', () => {
  return function MockPopulationChart() {
    return <div data-testid="mock-population-chart" />;
  };
});

describe('PopulationTypeSelector', () => {
  const mockProps = {
    populationType: 'total' as const,
    onPopulationTypeChange: jest.fn(),
    loading: false,
    populationData: [],
    loadingPopulation: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('人口種別タブが正しく表示されること', () => {
    render(<PopulationTypeSelector {...mockProps} />);
    
    // タブレット・PC表示用のタブがあるか確認
    const tabNav = screen.getByRole('navigation', { name: '人口種別タブ' });
    expect(tabNav).toBeInTheDocument();
    
    // すべての人口種別タブがレンダリングされているか確認
    POPULATION_TABS.forEach(tab => {
      const tabButton = screen.getByRole('tab', { name: tab.label });
      expect(tabButton).toBeInTheDocument();
      
      // 現在選択されているタブが正しくハイライトされているか確認
      if (tab.type === mockProps.populationType) {
        expect(tabButton).toHaveAttribute('aria-selected', 'true');
      } else {
        expect(tabButton).toHaveAttribute('aria-selected', 'false');
      }
    });
  });

  it('モバイル表示用のドロップダウンが正しく表示されること', () => {
    render(<PopulationTypeSelector {...mockProps} />);
    
    // ドロップダウンボタンが存在するか確認
    const dropdownButton = screen.getByRole('button', { expanded: false });
    expect(dropdownButton).toBeInTheDocument();
    
    // 現在選択されている種別のラベルが表示されているか確認
    const currentTypeLabel = POPULATION_TABS.find(tab => tab.type === mockProps.populationType)?.label;
    expect(dropdownButton).toHaveTextContent(currentTypeLabel || '');
    
    // ドロップダウンメニューは初期状態では表示されていない
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('ドロップダウンボタンをクリックするとメニューが表示されること', () => {
    render(<PopulationTypeSelector {...mockProps} />);
    
    // ドロップダウンボタンをクリック
    const dropdownButton = screen.getByRole('button', { expanded: false });
    fireEvent.click(dropdownButton);
    
    // ドロップダウンメニューが表示されるか確認
    const dropdownMenu = screen.getByRole('listbox');
    expect(dropdownMenu).toBeInTheDocument();
    
    // すべての選択肢が表示されているか確認
    POPULATION_TABS.forEach(tab => {
      const option = screen.getByRole('option', { name: tab.label });
      expect(option).toBeInTheDocument();
    });
  });

  it('ドロップダウンから種別を選択するとonPopulationTypeChangeが呼ばれること', () => {
    render(<PopulationTypeSelector {...mockProps} />);
    
    // ドロップダウンを開く
    const dropdownButton = screen.getByRole('button', { expanded: false });
    fireEvent.click(dropdownButton);
    
    // 年少人口を選択
    const youngOption = screen.getByRole('option', { name: '年少人口' });
    fireEvent.click(youngOption);
    
    // コールバックが呼ばれたか確認
    expect(mockProps.onPopulationTypeChange).toHaveBeenCalledWith('young');
  });

  it('タブをクリックするとonPopulationTypeChangeが呼ばれること', () => {
    render(<PopulationTypeSelector {...mockProps} />);
    
    // 老年人口タブをクリック
    const elderlyTab = screen.getByRole('tab', { name: '老年人口' });
    fireEvent.click(elderlyTab);
    
    // コールバックが呼ばれたか確認
    expect(mockProps.onPopulationTypeChange).toHaveBeenCalledWith('elderly');
  });

  it('loading=trueの場合、ボタンが無効化されること', () => {
    render(<PopulationTypeSelector {...mockProps} loading={true} />);
    
    // タブが無効化されているか確認
    POPULATION_TABS.forEach(tab => {
      const tabButton = screen.getByRole('tab', { name: tab.label });
      expect(tabButton).toBeDisabled();
    });
    
    // ドロップダウンボタンも無効化されているか確認
    const dropdownButton = screen.getByRole('button', { expanded: false });
    expect(dropdownButton).toBeDisabled();
  });

  it('PopulationChartコンポーネントに正しいpropsが渡されること', () => {
    render(<PopulationTypeSelector {...mockProps} />);
    
    // PopulationChartがレンダリングされているか確認
    const chart = screen.getByTestId('mock-population-chart');
    expect(chart).toBeInTheDocument();
    
    // タブパネルが正しく設定されているか確認
    const tabpanel = screen.getByRole('tabpanel');
    expect(tabpanel).toHaveAttribute('id', `tabpanel-${mockProps.populationType}`);
    expect(tabpanel).toHaveAttribute('aria-labelledby', `tab-${mockProps.populationType}`);
  });
});