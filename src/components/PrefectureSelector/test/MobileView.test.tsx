import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MobileView from '../MobileView';

// RegionBlockコンポーネントのモック
jest.mock('../RegionBlock', () => {
  return function MockRegionBlock(props: { regionId: string; regionName: string; prefectures: { prefCode: number; prefName: string }[]; loading: boolean }) {
    return (
      <div 
        data-testid={`region-block-${props.regionId}`} 
        data-region-name={props.regionName}
        data-prefectures-count={props.prefectures.length}
        data-loading={props.loading ? 'true' : 'false'}
      />
    );
  };
});

describe('MobileView', () => {
  const mockPrefectures = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
    { prefCode: 13, prefName: '東京都' },
    { prefCode: 27, prefName: '大阪府' }
  ];

  const mockRegionData = [
    {
      id: 'hokkaido',
      name: '北海道・東北',
      prefectures: [1, 2]
    },
    {
      id: 'kanto',
      name: '関東',
      prefectures: [13]
    },
    {
      id: 'kinki',
      name: '近畿',
      prefectures: [27]
    }
  ];

  const mockProps = {
    prefectures: mockPrefectures,
    regionData: mockRegionData,
    loading: false,
    isPrefectureSelected: jest.fn().mockImplementation(prefCode => prefCode === 1),
    onPrefectureClick: jest.fn(),
    getPrefecturesByRegion: jest.fn().mockImplementation(regionId => {
      const region = mockRegionData.find(r => r.id === regionId);
      if (!region) return [];
      return mockPrefectures.filter(pref => region.prefectures.includes(pref.prefCode));
    }),
    hoveredPrefCode: null,
    onPrefectureHover: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('MobileViewが正しくレンダリングされること', () => {
    render(<MobileView {...mockProps} />);
    
    // ルートコンテナがlg:hiddenで表示されているか確認
    const container = screen.getByRole('region', { name: '都道府県選択（モバイル表示）' });
    expect(container).toHaveClass('lg:hidden');
    
    // すべての地方ブロックがレンダリングされているか確認
    mockRegionData.forEach(region => {
      const regionBlock = screen.getByTestId(`region-block-${region.id}`);
      expect(regionBlock).toBeInTheDocument();
      expect(regionBlock).toHaveAttribute('data-region-name', region.name);
    });
  });

  it('GridレイアウトがMD以上で2カラム表示されること', () => {
    render(<MobileView {...mockProps} />);
    
    // グリッドコンテナがmd:grid-cols-2クラスを持っているか確認
    const gridContainer = screen.getByRole('region').firstChild;
    expect(gridContainer).toHaveClass('grid md:grid-cols-2');
  });

  it('地方ブロックに正しい都道府県データが渡されること', () => {
    render(<MobileView {...mockProps} />);
    
    // 各地方ブロックの都道府県数をチェック
    expect(screen.getByTestId('region-block-hokkaido')).toHaveAttribute('data-prefectures-count', '2');
    expect(screen.getByTestId('region-block-kanto')).toHaveAttribute('data-prefectures-count', '1');
    expect(screen.getByTestId('region-block-kinki')).toHaveAttribute('data-prefectures-count', '1');
    
    // getPrefecturesByRegionが各地方IDで呼ばれたことを確認
    mockRegionData.forEach(region => {
      expect(mockProps.getPrefecturesByRegion).toHaveBeenCalledWith(region.id);
    });
  });

  it('アクセシビリティ属性が正しく設定されていること', () => {
    render(<MobileView {...mockProps} />);
    
    // role="region"とaria-labelが設定されているか確認
    const regionContainer = screen.getByRole('region');
    expect(regionContainer).toHaveAttribute('aria-label', '都道府県選択（モバイル表示）');
  });

  it('loadingがtrueの場合、子コンポーネントに渡されること', () => {
    render(<MobileView {...mockProps} loading={true} />);
    
    // RegionBlockにloadingがtrueで渡されているか確認
    mockRegionData.forEach(region => {
      const regionBlock = screen.getByTestId(`region-block-${region.id}`);
      expect(regionBlock).toHaveAttribute('data-loading', 'true');
    });
  });
});