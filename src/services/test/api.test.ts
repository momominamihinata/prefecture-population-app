// apiモジュールをインポート（ESモジュール形式）
import api from '../api';

// axiosのcreateメソッドをモック化
jest.mock('axios', () => ({
  create: jest.fn().mockReturnValue({})
}));

describe('api', () => {
  it('apiモジュールが正しくエクスポートされていることを確認', () => {
    // テストケースが必要ならここに追加
    expect(api).toBeDefined();
  });
});