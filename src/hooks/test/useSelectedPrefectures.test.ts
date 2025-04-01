import { renderHook, act } from '@testing-library/react';
import { useSelectedPrefectures } from '../useSelectedPrefectures';

describe('useSelectedPrefectures', () => {
  it('初期状態では選択された都道府県が空', () => {
    const { result } = renderHook(() => useSelectedPrefectures());
    
    expect(result.current.selectedPrefCodes.size).toBe(0);
  });

  it('togglePrefecture: 都道府県を選択するとセットに追加される', () => {
    const { result } = renderHook(() => useSelectedPrefectures());
    
    act(() => {
      result.current.togglePrefecture(1, true);
    });
    
    expect(result.current.selectedPrefCodes.has(1)).toBe(true);
    expect(result.current.selectedPrefCodes.size).toBe(1);
  });

  it('togglePrefecture: 都道府県の選択を解除するとセットから削除される', () => {
    const { result } = renderHook(() => useSelectedPrefectures());
    
    // まず選択
    act(() => {
      result.current.togglePrefecture(1, true);
    });
    
    // 次に選択解除
    act(() => {
      result.current.togglePrefecture(1, false);
    });
    
    expect(result.current.selectedPrefCodes.has(1)).toBe(false);
    expect(result.current.selectedPrefCodes.size).toBe(0);
  });

  it('isPrefectureSelected: 選択状態を正しく判定する', () => {
    const { result } = renderHook(() => useSelectedPrefectures());
    
    // 都道府県1を選択
    act(() => {
      result.current.togglePrefecture(1, true);
    });
    
    expect(result.current.isPrefectureSelected(1)).toBe(true);
    expect(result.current.isPrefectureSelected(2)).toBe(false);
  });

  it('clearSelection: 全ての選択を解除する', () => {
    const { result } = renderHook(() => useSelectedPrefectures());
    
    // いくつかの都道府県を選択
    act(() => {
      result.current.togglePrefecture(1, true);
      result.current.togglePrefecture(2, true);
      result.current.togglePrefecture(3, true);
    });
    
    // 選択解除
    act(() => {
      result.current.clearSelection();
    });
    
    expect(result.current.selectedPrefCodes.size).toBe(0);
  });

  it('getSelectedPrefectures: 選択された都道府県のリストを返す', () => {
    const { result } = renderHook(() => useSelectedPrefectures());
    
    const mockPrefectures = [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
      { prefCode: 3, prefName: '岩手県' },
    ];
    
    // 都道府県1と3を選択
    act(() => {
      result.current.togglePrefecture(1, true);
      result.current.togglePrefecture(3, true);
    });
    
    const selectedPrefectures = result.current.getSelectedPrefectures(mockPrefectures);
    
    expect(selectedPrefectures).toHaveLength(2);
    expect(selectedPrefectures[0].prefCode).toBe(1);
    expect(selectedPrefectures[1].prefCode).toBe(3);
  });
});