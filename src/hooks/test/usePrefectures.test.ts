import { renderHook, waitFor } from '@testing-library/react';
import { usePrefectures } from '../usePrefectures';
import { fetchPrefectures } from '@/services/prefectureApi';
import { Prefecture } from '@/types/prefecture';

jest.mock('@/services/prefectureApi');

describe('usePrefectures', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('都道府県データを正常に取得する', async () => {
    const mockPrefectures: Prefecture[] = [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' }
    ];

    (fetchPrefectures as jest.Mock).mockResolvedValue({
      result: mockPrefectures
    });

    const { result } = renderHook(() => usePrefectures());

    // 非同期で都道府県データ取得を待つ
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchPrefectures).toHaveBeenCalledTimes(1);
    expect(result.current.prefectures).toEqual(mockPrefectures);
    expect(result.current.error).toBeNull();
  });

  it('都道府県データの取得に失敗した場合にエラーを返す', async () => {
    (fetchPrefectures as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => usePrefectures());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchPrefectures).toHaveBeenCalledTimes(1);
    expect(result.current.prefectures).toEqual([]);
    expect(result.current.error).toEqual(new Error('API Error'));
  });

  it('エラーが非 Error インスタンスでも補足できる', async () => {
    (fetchPrefectures as jest.Mock).mockRejectedValue('非Errorな例外');

    const { result } = renderHook(() => usePrefectures());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.prefectures).toEqual([]);
    expect(result.current.error?.message).toBe('都道府県データの取得に失敗しました');
  });
});
