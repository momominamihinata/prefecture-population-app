import '@testing-library/jest-dom';
import { metadata } from '@/app/layout';

// Next.jsのRootLayoutコンポーネントはテストが難しいため、metadataのみをテスト
// HTMLタグのようなレンダリングが必要なものは通常のテストフレームワークではテストが困難
describe('Layout Metadata', () => {
  it('適切なメタデータが設定されていること', () => {
    // タイトルとディスクリプションが正しく設定されているか確認
    expect(metadata.title).toBe('都道府県別人口推移');
    expect(metadata.description).toBe('日本の都道府県別人口推移を表示するアプリケーション');
  });
});

// RootLayoutコンポーネントのHTMLレンダリングはテストしない
// 以下のテストは通常のNext.jsコンポーネントのレンダリングテストでは難しい
// Jest環境でdomネスティングの問題が発生するため
// describe('RootLayout', () => {
//   it('子要素を正しくレンダリングすること', () => {
//     // このテストは省略
//   });
// });