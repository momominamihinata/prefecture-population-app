import { renderHook, act } from '@testing-library/react';
import { useSelectedPrefectures } from '../useSelectedPrefectures';

describe('useSelectedPrefectures', () => {
  it('初期状態では何も選択されていない', () => {
    const { result } = renderHook(() => useSelectedPrefectures());
    expect(result.current.selectedPrefCodes.size).toBe(0);
  });

  it('togglePrefecture: 都道府県を選択するとSetに追加される', () => {
    const { result } = renderHook(() => useSelectedPrefectures());

    act(() => {
      result.current.togglePrefecture(1, true);
    });

    expect(result.current.selectedPrefCodes.has(1)).toBe(true);
  });

  it('togglePrefecture: 都道府県の選択を解除するとSetから削除される', () => {
    const { result } = renderHook(() => useSelectedPrefectures());

    act(() => {
      result.current.togglePrefecture(1, true);
      result.current.togglePrefecture(2, true);
      result.current.togglePrefecture(1, false); // 1 を解除
    });

    expect(result.current.selectedPrefCodes.has(1)).toBe(false);
    expect(result.current.selectedPrefCodes.has(2)).toBe(true);
  });

  it('isPrefectureSelected: 選択状態を確認できる', () => {
    const { result } = renderHook(() => useSelectedPrefectures());

    act(() => {
      result.current.togglePrefecture(3, true);
    });

    expect(result.current.isPrefectureSelected(3)).toBe(true);
    expect(result.current.isPrefectureSelected(4)).toBe(false);
  });

  it('getSelectedPrefectures: 選択されている都道府県リストを返す', () => {

    const { result } = renderHook(() => useSelectedPrefectures());

    act(() => {
      result.current.togglePrefecture(2, true);
      result.current.togglePrefecture(3, true);
    });
  });
});
