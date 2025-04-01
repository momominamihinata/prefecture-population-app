import { fetchPrefectures } from '../prefectureApi';
import api from '../api';

// apiモジュールのgetメソッドをモック化
jest.mock('../api', () => ({
  get: jest.fn(),
}));

describe('prefectureApi', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();
  });

  it('都道府県一覧を正常に取得できる', async () => {
    // モックの応答データを設定
    const mockResponse = {
      data: {
        message: null,
        result: [
          { prefCode: 1, prefName: '北海道' },
          { prefCode: 2, prefName: '青森県' },
        ],
      },
    };
    
    // apiのgetメソッドが上記のモックデータを返すように設定
    (api.get as jest.Mock).mockResolvedValue(mockResponse);

    // APIを呼び出し
    const result = await fetchPrefectures();
    
    // 正しいエンドポイントが呼び出されたか検証
    expect(api.get).toHaveBeenCalledWith('/prefectures');
    
    // 期待通りのデータが返されたか検証
    expect(result).toEqual(mockResponse.data);
  });

  it('APIエラー時に例外をスローする', async () => {
    // エラーをシミュレート
    const error = new Error('API error');
    (api.get as jest.Mock).mockRejectedValue(error);
    
    // APIを呼び出し、例外が発生することを検証
    await expect(fetchPrefectures()).rejects.toThrow('API error');
    
    // コンソールエラーのチェックはスキップ（コンソール出力をLintエラーで削除したため）
  });
});