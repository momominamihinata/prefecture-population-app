import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScrollToChartButton from './ScrollToChartButton';

describe('ScrollToChartButton', () => {
  let scrollIntoViewMock: jest.Mock;

  beforeEach(() => {
    // scrollIntoViewのモック
    scrollIntoViewMock = jest.fn();
    
    // getElementByIdのモック
    document.getElementById = jest.fn().mockImplementation((id) => {
      if (id === 'population-chart') {
        return {
          scrollIntoView: scrollIntoViewMock
        };
      }
      return null;
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('ボタンが正しくレンダリングされること', () => {
    render(<ScrollToChartButton />);
    
    // ボタンが存在するか確認
    const button = screen.getByRole('button', { name: /グラフを見る/i });
    expect(button).toBeInTheDocument();
    
    // テキストが正しいか確認
    expect(button).toHaveTextContent('グラフを見る');
    
    // SVGアイコンが存在するか確認
    const svgIcon = button.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  it('ボタンクリック時にグラフ要素までスクロールすること', () => {
    render(<ScrollToChartButton />);
    
    // ボタンを取得してクリック
    const button = screen.getByRole('button', { name: /グラフを見る/i });
    fireEvent.click(button);
    
    // getElementById が 'population-chart' で呼ばれたか確認
    expect(document.getElementById).toHaveBeenCalledWith('population-chart');
    
    // scrollIntoView が正しいオプションで呼ばれたか確認
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('グラフ要素が存在しない場合はスクロールしないこと', () => {
    // getElementById の実装を一時的に変更して null を返すように
    (document.getElementById as jest.Mock).mockImplementationOnce(() => null);
    
    render(<ScrollToChartButton />);
    
    const button = screen.getByRole('button', { name: /グラフを見る/i });
    fireEvent.click(button);
    
    // getElementById は呼ばれるが、scrollIntoView は呼ばれないはず
    expect(document.getElementById).toHaveBeenCalledWith('population-chart');
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('アクセシビリティ属性が正しく設定されていること', () => {
    render(<ScrollToChartButton />);
    
    const button = screen.getByRole('button', { name: /グラフを見る/i });
    
    // aria-label が正しく設定されているか確認
    expect(button).toHaveAttribute('aria-label', 'グラフを見る');
  });
});