import React from 'react';
import { JapanMapProps } from '@/types/types';
import { japanPrefectureData } from './japanPrefectureData';

const JapanMap: React.FC<JapanMapProps> = ({ 
  onPrefectureClick, 
  isPrefectureSelected, 
  hoveredPrefCode,
  onPrefectureHover
}) => {
  return (
    <svg 
      className="w-full h-full"
      viewBox="-500 -100 2000 1200"
      role="img"
      aria-label="日本地図 - クリックして都道府県を選択できます"
    >
      <g className="svg-map" transform="matrix(1.028807, 0, 0, 1.028807, -47.544239, -28.806583)">
        <g className="boundary-line" stroke="#CCC" strokeWidth={4} strokeLinejoin="round">
          <line x1="340.227" y1="591.996" x2="602.351" y2="299.378" />
          <line x1="297.337" y1="610.162" x2="66.213" y2="610.162" />
        </g>
        
        {japanPrefectureData.map(prefecture => {
          // 選択状態とホバー状態に基づいて色を決定
          const isSelected = isPrefectureSelected(prefecture.code);
          const isHovered = hoveredPrefCode === prefecture.code;
          
          let fillColor = '#EEE'; // デフォルト色
          if (isSelected) {
            fillColor = '#3B82F6'; // 選択時の青色
          } else if (isHovered) {
            fillColor = '#93C5FD'; // ホバー時の薄い青色
          }
          
          return (
            <g
              key={prefecture.code}
              data-code={prefecture.code}
              strokeLinejoin="round"
              fill={fillColor}
              fillRule="nonzero"
              stroke="#000"
              strokeWidth={1.0}
              transform={prefecture.transform}
              onClick={() => onPrefectureClick(prefecture.code, prefecture.name)}
              onMouseEnter={() => onPrefectureHover && onPrefectureHover(prefecture.code)}
              onMouseLeave={() => onPrefectureHover && onPrefectureHover(null)}
              style={{ 
                cursor: 'pointer',
                transition: 'fill 0.2s ease-in-out'
              }}
            >
              <title>{prefecture.name}</title>
              {/* パスをレンダリング */}
              {prefecture.paths.map((path, index) => (
                <path key={`path-${index}`} d={path} />
              ))}
              {/* ポリゴンをレンダリング（存在する場合） */}
              {prefecture.polygons?.map((points, index) => (
                <polygon key={`polygon-${index}`} points={points} />
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default JapanMap;