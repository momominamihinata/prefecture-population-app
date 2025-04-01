import { renderHook, waitFor } from '@testing-library/react';
import { usePrefectures } from '../usePrefectures';
import { fetchPrefectures } from '@/services/prefectureApi';

// APIモジュールをモック化
jest.mock('@/services/prefectureApi');

describe('usePrefectures', () => {
  // テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('初期状態ではローディング状態がtrueで都道府県一覧が空', () => {
    const { result } = renderHook(() => usePrefectures());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.prefectures).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('APIが成功した場合、都道府県一覧が設定される', async () => {
    // APIレスポンスのモックデータ
    const mockPrefectures = [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ];
    
    // APIが成功して結果を返すことをシミュレート
    (fetchPrefectures as jest.Mock).mockResolvedValue({
      message: null,
      result: mockPrefectures,
    });
    
    // フックをレンダリング
    const { result } = renderHook(() => usePrefectures());
    
    // 非同期処理の完了を待つ
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // 都道府県一覧が正しく設定されていることを確認
    expect(result.current.prefectures).toEqual(mockPrefectures);
    expect(result.current.error).toBeNull();
    
    // APIが1回だけ呼ばれたことを確認
    expect(fetchPrefectures).toHaveBeenCalledTimes(1);
  });

  it('APIがエラーを返した場合、エラー状態が設定される', async () => {
    // APIがエラーを返すことをシミュレート
    const mockError = new Error('API error');
    (fetchPrefectures as jest.Mock).mockRejectedValue(mockError);
    
    // フックをレンダリング
    const { result } = renderHook(() => usePrefectures());
    
    // 非同期処理の完了を待つ
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // エラー状態が正しく設定されていることを確認
    expect(result.current.error).not.toBeNull();
    expect(result.current.prefectures).toEqual([]);
  });
});