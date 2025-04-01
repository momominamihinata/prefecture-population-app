import { renderHook, act, waitFor } from '@testing-library/react';
import { usePopulation } from '../usePopulation';
import { fetchPopulation } from '@/services/populationApi';
import {
  extractPopulationDataByType,
  removePopulationData
} from '@/utils/populationDataFormatter';

jest.mock('@/services/populationApi');
jest.mock('@/utils/populationDataFormatter', () => ({
  extractPopulationDataByType: jest.fn(),
  removePopulationData: jest.fn()
}));

describe('usePopulation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態の確認', () => {
    const { result } = renderHook(() => usePopulation());

    expect(result.current.populationData).toEqual([]);
    expect(result.current.populationType).toBe('total');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('都道府県選択でデータが追加される', async () => {
    const mockResponse = {
      result: {
        boundaryYear: 2020,
        data: [{ label: '総人口', data: [{ year: 2015, value: 5000000 }] }]
      }
    };
    const mockFormattedData = [{ year: 2015, value: 5000000 }];

    (fetchPopulation as jest.Mock).mockResolvedValue(mockResponse);
    (extractPopulationDataByType as jest.Mock).mockReturnValue(mockFormattedData);

    const { result } = renderHook(() => usePopulation());

    await act(async () => {
      await result.current.togglePrefecture(1, '北海道', true);
    });

    expect(fetchPopulation).toHaveBeenCalledWith(1);
    expect(extractPopulationDataByType).toHaveBeenCalledWith(mockResponse.result, 'total');

    expect(result.current.populationData).toEqual([
      { prefCode: 1, prefName: '北海道', data: mockFormattedData }
    ]);
  });

  it('都道府県選択を解除するとデータが削除される', async () => {  
    const filteredData = [
      { prefCode: 2, prefName: '青森県', data: [] }
    ];
  
    (fetchPopulation as jest.Mock).mockResolvedValue({
      result: {
        boundaryYear: 2020,
        data: []
      }
    });
  
    (extractPopulationDataByType as jest.Mock).mockReturnValue([]);
  
    (removePopulationData as jest.Mock).mockReturnValue(filteredData);
  
    const { result } = renderHook(() => usePopulation());
  
    // まず都道府県を2つ選択状態にする
    await act(async () => {
      await result.current.togglePrefecture(1, '北海道', true);
      await result.current.togglePrefecture(2, '青森県', true);
    });
  
    // 解除
    await act(async () => {
      await result.current.togglePrefecture(1, '北海道', false);
    });
  
    expect(removePopulationData).toHaveBeenCalledWith(expect.anything(), 1);
    expect(result.current.populationData).toEqual(filteredData);
  });  

  it('人口種別を変更するとすべての都道府県データが更新される', async () => {
    const mockResponse1 = {
      result: {
        data: [{ label: '年少人口', data: [{ year: 2015, value: 1000000 }] }]
      }
    };
    const mockResponse2 = {
      result: {
        data: [{ label: '年少人口', data: [{ year: 2015, value: 2000000 }] }]
      }
    };
  
    const formatted1 = [{ year: 2015, value: 1000000 }];
    const formatted2 = [{ year: 2015, value: 2000000 }];
  
    const fetchPopulationMock = fetchPopulation as jest.Mock;
    const extractMock = extractPopulationDataByType as jest.Mock;
  
    fetchPopulationMock.mockReset();
    extractMock.mockReset();
  
    fetchPopulationMock
      .mockResolvedValueOnce(mockResponse1) // 北海道
      .mockResolvedValueOnce(mockResponse2) // 青森県
      .mockResolvedValueOnce(mockResponse1) // 北海道 (再取得)
      .mockResolvedValueOnce(mockResponse2); // 青森県 (再取得)
  
    extractMock
      .mockReturnValueOnce(formatted1)
      .mockReturnValueOnce(formatted2)
      .mockReturnValueOnce(formatted1)
      .mockReturnValueOnce(formatted2);
  
    const { result } = renderHook(() => usePopulation());
  
    await act(async () => {
      await result.current.togglePrefecture(1, '北海道', true);
      await result.current.togglePrefecture(2, '青森県', true);
    });
  
    await act(async () => {
      expect(result.current.populationData.length).toBe(2);

      await result.current.changePopulationType('young');
    });
  
    await waitFor(() => {
      expect(fetchPopulationMock).toHaveBeenCalledTimes(4); // 2 + 2
    });
  
    expect(result.current.populationType).toBe('young');
    expect(result.current.populationData).toEqual([
      { prefCode: 1, prefName: '北海道', data: formatted1 },
      { prefCode: 2, prefName: '青森県', data: formatted2 }
    ]);
  });
  
});
