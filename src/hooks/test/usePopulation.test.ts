import { renderHook, act } from '@testing-library/react';
import { usePopulation } from '../usePopulation';
import { fetchPopulation } from '@/services/populationApi';
import { 
  extractPopulationDataByType, 
  isPrefectureSelected,
  removePopulationData 
} from '@/utils/populationDataFormatter';

// モジュールをモック化
jest.mock('@/services/populationApi');
jest.mock('@/utils/populationDataFormatter', () => ({
  extractPopulationDataByType: jest.fn(),
  isPrefectureSelected: jest.fn(),
  removePopulationData: jest.fn()
}));

describe('usePopulation', () => {
  // テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態では人口データが空配列', () => {
    const { result } = renderHook(() => usePopulation());
    
    expect(result.current.populationData).toEqual([]);
    expect(result.current.populationType).toBe('total');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('togglePrefecture: 都道府県を選択するとデータが追加される', async () => {
    // モックの戻り値を設定
    (isPrefectureSelected as jest.Mock).mockReturnValue(false);
    
    const mockPopulationResponse = {
      result: {
        boundaryYear: 2020,
        data: [{ label: '総人口', data: [{ year: 2015, value: 5000000 }] }]
      }
    };
    
    (fetchPopulation as jest.Mock).mockResolvedValue(mockPopulationResponse);
    
    const mockExtractedData = [{ year: 2015, value: 5000000 }];
    (extractPopulationDataByType as jest.Mock).mockReturnValue(mockExtractedData);
    
    // フックをレンダリング
    const { result } = renderHook(() => usePopulation());
    
    // 都道府県選択（非同期関数を実行するためにactで囲む）
    await act(async () => {
      await result.current.togglePrefecture(1, '北海道', true);
    });
    
    // データが正しく追加されたか確認
    expect(result.current.populationData).toEqual([
      {
        prefCode: 1,
        prefName: '北海道',
        data: mockExtractedData
      }
    ]);
    
    // API呼び出しや関数呼び出しが正しく行われたか確認
    expect(fetchPopulation).toHaveBeenCalledWith(1);
    expect(extractPopulationDataByType).toHaveBeenCalledWith(
      mockPopulationResponse.result,
      'total'
    );
  });

  it('togglePrefecture: 都道府県の選択を解除するとデータが削除される', async () => {
    // モックのデータを設定
    const initialData = [
      { prefCode: 1, prefName: '北海道', data: [] },
      { prefCode: 2, prefName: '青森県', data: [] }
    ];
    
    const filteredData = [
      { prefCode: 2, prefName: '青森県', data: [] }
    ];
    
    // 選択解除後のデータをモック
    (removePopulationData as jest.Mock).mockReturnValue(filteredData);
    
    // フックをレンダリングしてinitialStateを設定
    const { result } = renderHook(() => {
      const hook = usePopulation();
      if (hook.populationData.length === 0) {
        hook.populationData = initialData;
      }
      return hook;
    });
    
    // 都道府県選択解除
    await act(async () => {
      await result.current.togglePrefecture(1, '北海道', false);
    });
    
    // データが正しく削除されたか確認
    expect(removePopulationData).toHaveBeenCalledWith(
      expect.anything(),
      1
    );
  });

  it('changePopulationType: 人口種別を変更するとすべてのデータが更新される', async () => {
    // モックのデータを設定
    const initialData = [
      { prefCode: 1, prefName: '北海道', data: [] },
      { prefCode: 2, prefName: '青森県', data: [] }
    ];
    
    const mockPopulationResponse = {
      result: {
        boundaryYear: 2020,
        data: [{ label: '年少人口', data: [{ year: 2015, value: 600000 }] }]
      }
    };
    
    (fetchPopulation as jest.Mock).mockResolvedValue(mockPopulationResponse);
    
    const mockExtractedData = [{ year: 2015, value: 600000 }];
    (extractPopulationDataByType as jest.Mock).mockReturnValue(mockExtractedData);
    
    // フックをレンダリング
    const { result } = renderHook(() => usePopulation());
    
    // フックの初期状態を設定
    act(() => {
      result.current.populationData = initialData;
    });
    
    // 人口種別変更
    await act(async () => {
      await result.current.changePopulationType('young');
    });
    
    // 人口種別が変更されたか確認
    expect(result.current.populationType).toBe('young');
    
    // すべての県のデータがAPIから再取得されたか確認
    expect(fetchPopulation).toHaveBeenCalledTimes(2);
    expect(fetchPopulation).toHaveBeenCalledWith(1);
    expect(fetchPopulation).toHaveBeenCalledWith(2);
    
    // 種別指定の抽出関数が呼ばれたか確認
    expect(extractPopulationDataByType).toHaveBeenCalledWith(
      mockPopulationResponse.result,
      'young'
    );
  });
});