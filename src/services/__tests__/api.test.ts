describe('api', () => {
  it('apiモジュールが正しくエクスポートされていることを確認', () => {
    // api.tsからインポートされたオブジェクトが存在するか確認
    const api = require('../api').default;
    expect(api).toBeDefined();
  });
});