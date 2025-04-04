import { useState, useCallback } from 'react';

/**
 * 選択された都道府県の状態を管理するカスタムフック
 * @returns 選択された都道府県の状態と操作関数
 */
export const useSelectedPrefectures = () => {
  // 選択された都道府県コードのセット
  const [selectedPrefCodes, setSelectedPrefCodes] = useState<Set<number>>(new Set());

  /**
   * 都道府県の選択状態を切り替える
   * @param prefCode 都道府県コード
   * @param selected 選択状態（trueで選択、falseで選択解除）
   * @returns 変更後の選択状態
   */
  const togglePrefecture = useCallback((prefCode: number, selected: boolean): boolean => {
    setSelectedPrefCodes(prev => {
      const newSet = new Set(prev);
      
      if (selected) {
        newSet.add(prefCode);
      } else {
        newSet.delete(prefCode);
      }
      
      return newSet;
    });
    
    return selected;
  }, []);

  /**
   * 都道府県が選択されているかどうかを確認
   * @param prefCode 都道府県コード
   * @returns 選択されている場合はtrue
   */
  const isPrefectureSelected = useCallback((prefCode: number): boolean => {
    return selectedPrefCodes.has(prefCode);
  }, [selectedPrefCodes]);

  return {
    selectedPrefCodes,    // 選択された都道府県コードのセット
    togglePrefecture,     // 都道府県選択・解除関数
    isPrefectureSelected, // 選択状態確認関数
  };
};