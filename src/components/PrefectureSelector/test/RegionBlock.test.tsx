import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegionBlock from '../RegionBlock';

describe('RegionBlock', () => {
  const mockPrefectures = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
    { prefCode: 3, prefName: '岩手県' }
  ];

  const mockProps = {
    regionId: 'hokkaido',
    regionName: '北海道・東北',
    prefectures: mockPrefectures,
    loading: false,
    isPrefectureSelected: jest.fn().mockImplementation(prefCode => prefCode === 1),
    onPrefectureClick: jest.fn(),
    hoveredPrefCode: null,
    onPrefectureHover: jest.fn(),
    className: 'test-class'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('地域名と都道府県が正しく表示されること', () => {
    render(<RegionBlock {...mockProps} />);
    
    // 地域名が表示されているか確認
    expect(screen.getByText('北海道・東北')).toBeInTheDocument();
    
    // 各都道府県のボタンが表示されているか確認
    mockPrefectures.forEach(pref => {
      expect(screen.getByRole('button', { name: new RegExp(`${pref.prefName}`) })).toBeInTheDocument();
    });
  });

  it('都道府県の選択状態が正しく表示されること', () => {
    render(<RegionBlock {...mockProps} />);
    
    // 選択状態の都道府県をチェック
    const selectedButton = screen.getByRole('button', { name: /北海道/ });
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
    
    // 非選択状態の都道府県をチェック
    const nonSelectedButton = screen.getByRole('button', { name: /青森県/ });
    expect(nonSelectedButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('都道府県ボタンをクリックするとonPrefectureClickが呼ばれること', () => {
    render(<RegionBlock {...mockProps} />);
    
    // 青森県のボタンをクリック
    const aomoriButton = screen.getByRole('button', { name: /青森県/ });
    fireEvent.click(aomoriButton);
    
    // コールバックが正しく呼ばれたか確認
    expect(mockProps.onPrefectureClick).toHaveBeenCalledWith(2, '青森県');
  });

  it('都道府県ボタンにマウスオーバーするとonPrefectureHoverが呼ばれること', () => {
    render(<RegionBlock {...mockProps} />);
    
    // 岩手県のボタンにマウスオーバー
    const iwateButton = screen.getByRole('button', { name: /岩手県/ });
    fireEvent.mouseEnter(iwateButton);
    
    // コールバックが正しく呼ばれたか確認
    expect(mockProps.onPrefectureHover).toHaveBeenCalledWith(3);
    
    // マウスリーブ時も確認
    fireEvent.mouseLeave(iwateButton);
    expect(mockProps.onPrefectureHover).toHaveBeenCalledWith(null);
  });

  it('ホバー状態の都道府県が正しくスタイリングされること', () => {
    // ホバー状態ありでレンダリング
    render(<RegionBlock {...mockProps} hoveredPrefCode={2} />);
    
    // ホバー状態のボタンのクラス名を確認
    const hoveredButton = screen.getByRole('button', { name: /青森県/ });
    expect(hoveredButton.className).toContain('bg-blue-200');
    
    // 非ホバー状態のボタンのクラス名を確認
    const nonHoveredButton = screen.getByRole('button', { name: /岩手県/ });
    expect(nonHoveredButton.className).toContain('bg-white');
  });

  it('loading=trueの場合、ボタンが無効化されること', () => {
    render(<RegionBlock {...mockProps} loading={true} />);
    
    // すべてのボタンが無効化されているか確認
    mockPrefectures.forEach(pref => {
      const button = screen.getByRole('button', { name: new RegExp(`${pref.prefName}`) });
      expect(button).toBeDisabled();
    });
  });

  it('渡されたclassNameが適用されること', () => {
    render(<RegionBlock {...mockProps} />);
    
    // 地域ブロックのコンテナにclassNameが適用されているか確認
    const container = screen.getByRole('region');
    expect(container.className).toContain('test-class');
  });

  it('アクセシビリティ属性が正しく設定されていること', () => {
    render(<RegionBlock {...mockProps} />);
    
    // 地域ブロックのregion roleとaria-labelledby属性
    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('aria-labelledby', 'region-heading-hokkaido');
    
    // 見出し要素のid
    const heading = screen.getByText('北海道・東北');
    expect(heading).toHaveAttribute('id', 'region-heading-hokkaido');
    
    // 都道府県グループのroleとaria-label
    const prefGroup = screen.getByRole('group');
    expect(prefGroup).toHaveAttribute('aria-label', '北海道・東北の都道府県');
    
    // 選択状態の北海道ボタンのaria-label
    const hokkaidoButton = screen.getByRole('button', { name: /北海道/ });
    expect(hokkaidoButton).toHaveAttribute('aria-label', '北海道を選択解除');
    
    // 非選択状態の青森県ボタンのaria-label
    const aomoriButton = screen.getByRole('button', { name: /青森県/ });
    expect(aomoriButton).toHaveAttribute('aria-label', '青森県を選択');
  });
});