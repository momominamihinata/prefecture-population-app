/**
 * 都道府県の情報を表す型
 */
export interface Prefecture {
  prefCode: number;
  prefName: string;
}

/**
 * 都道府県一覧APIのレスポンス型
 */
export interface PrefectureResponse {
  message: null | string;
  result: Prefecture[];
}