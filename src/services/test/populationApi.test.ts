import { fetchPopulation } from '../populationApi';
import api from '../api';

// apiモジュールのgetメソッドをモック化
jest.mock('../api', () => ({
  get: jest.fn(),
}));

describe('populationApi', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();
  });

  it('人口データを正常に取得できる', async () => {
    // モックの応答データを設定
    const mockResponse = {
      data: {
        message: null,
        result: {
          boundaryYear: 2020,
          data: [
            {
              label: '総人口',
              data: [
                { year: 2015, value: 5000000 },
                { year: 2020, value: 4900000 },
              ],
            },
          ],
        },
      },
    };
    
    // apiのgetメソッドが上記のモックデータを返すように設定
    (api.get as jest.Mock).mockResolvedValue(mockResponse);

    // 都道府県コード
    const prefCode = 1;
    
    // APIを呼び出し
    const result = await fetchPopulation(prefCode);
    
    // 正しいエンドポイントとパラメータが呼び出されたか検証
    expect(api.get).toHaveBeenCalledWith('/population/composition/perYear', {
      params: {
        prefCode: 1,
        cityCode: '-',
      },
    });
    
    // 期待通りのデータが返されたか検証
    expect(result).toEqual(mockResponse.data);
  });

  it('APIエラー時に例外をスローする', async () => {
    // エラーをシミュレート
    const error = new Error('API error');
    (api.get as jest.Mock).mockRejectedValue(error);
    
    // APIを呼び出し、例外が発生することを検証
    await expect(fetchPopulation(1)).rejects.toThrow('API error');
    
    // コンソールエラーのチェックはスキップ（コンソール出力を削除したため）
  });
});