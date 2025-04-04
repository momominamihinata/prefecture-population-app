import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DesktopView from '../DesktopView';
import { REGION_POSITIONS } from '@/types/constants';

// JapanMapとRegionBlockコンポーネントのモック
jest.mock('../JapanMap', () => {
  return function MockJapanMap({ onPrefectureClick, isPrefectureSelected, hoveredPrefCode, onPrefectureHover }: {
    onPrefectureClick?: (prefCode: number) => void;
    isPrefectureSelected?: (prefCode: number) => boolean;
    hoveredPrefCode: number | null;
    onPrefectureHover?: (prefCode: number | null) => void;
  }) {
    return (
      <div 
        data-testid="japan-map" 
        data-on-prefecture-click={!!onPrefectureClick ? 'true' : 'false'} 
        data-is-prefecture-selected={!!isPrefectureSelected ? 'true' : 'false'}
        data-hovered-pref-code={hoveredPrefCode !== null ? hoveredPrefCode : ''}
        data-on-prefecture-hover={!!onPrefectureHover ? 'true' : 'false'}
      />
    );
  };
});

jest.mock('../RegionBlock', () => {
  return function MockRegionBlock({ regionId, regionName, prefectures }: { regionId: string; regionName: string; prefectures: number[] }) {
    return (
      <div 
        data-testid={`region-block-${regionId}`} 
        data-region-name={regionName}
        data-prefectures-count={prefectures.length}
      />
    );
  };
});

describe('DesktopView', () => {
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

  it('DesktopViewが正しくレンダリングされること', () => {
    const { container } = render(<DesktopView {...mockProps} />);
    
    // ルートコンテナがlg:blockで表示されているか確認
    const rootContainer = container.firstChild;
    expect(rootContainer).toHaveClass('hidden lg:block');
    
    // 地図コンポーネントがレンダリングされているか確認
    expect(screen.getByTestId('japan-map')).toBeInTheDocument();
    
    // 地方ブロックコンポーネントが正しい数だけレンダリングされているか確認
    REGION_POSITIONS.forEach(({ id }) => {
      const region = mockRegionData.find(r => r.id === id);
      if (region) {
        const regionBlock = screen.getByTestId(`region-block-${id}`);
        expect(regionBlock).toBeInTheDocument();
        expect(regionBlock).toHaveAttribute('data-region-name', region.name);
      }
    });
  });

  it('地方ブロックに正しい都道府県データが渡されること', () => {
    render(<DesktopView {...mockProps} />);
    
    // 各地方ブロックの都道府県数をチェック
    expect(screen.getByTestId('region-block-hokkaido')).toHaveAttribute('data-prefectures-count', '2');
    expect(screen.getByTestId('region-block-kanto')).toHaveAttribute('data-prefectures-count', '1');
    expect(screen.getByTestId('region-block-kinki')).toHaveAttribute('data-prefectures-count', '1');
    
    // getPrefecturesByRegionが各地方IDで呼ばれたことを確認
    REGION_POSITIONS.forEach(({ id }) => {
      const region = mockRegionData.find(r => r.id === id);
      if (region) {
        expect(mockProps.getPrefecturesByRegion).toHaveBeenCalledWith(id);
      }
    });
  });

  it('地図コンポーネントに正しいpropsが渡されること', () => {
    render(<DesktopView {...mockProps} />);
    
    // JapanMapコンポーネントに正しいpropsが渡されているか確認
    const japanMap = screen.getByTestId('japan-map');
    expect(japanMap).toHaveAttribute('data-on-prefecture-click', 'true');
    expect(japanMap).toHaveAttribute('data-is-prefecture-selected', 'true');
    expect(japanMap).toHaveAttribute('data-hovered-pref-code', '');
    expect(japanMap).toHaveAttribute('data-on-prefecture-hover', 'true');
  });

  it('hoveredPrefCodeがnullでない場合、正しく渡されること', () => {
    render(<DesktopView {...mockProps} hoveredPrefCode={13} />);
    
    // hoveredPrefCodeが正しく渡されているか確認
    const japanMap = screen.getByTestId('japan-map');
    expect(japanMap).toHaveAttribute('data-hovered-pref-code', '13');
  });

  it('地方ブロックが正しい位置に配置されること', () => {
    render(<DesktopView {...mockProps} />);
    
    // REGION_POSITIONSの各地方の位置スタイルが適用されているか確認
    REGION_POSITIONS.forEach(({ id, position }) => {
      const region = mockRegionData.find(r => r.id === id);
      if (region) {
        const regionBlockContainer = screen.getByTestId(`region-block-${id}`).parentElement;
        expect(regionBlockContainer).toHaveClass(`absolute ${position}`);
      }
    });
  });
});