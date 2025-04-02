import { RegionData, RegionPosition } from './types';

// 地方区分情報
export const REGION_DATA: RegionData[] = [
  {
    id: 'hokkaido',
    name: '北海道',
    prefectures: [1], // 北海道
  },
  {
    id: 'tohoku',
    name: '東北',
    prefectures: [2, 3, 4, 5, 6, 7], // 青森、岩手、宮城、秋田、山形、福島
  },
  {
    id: 'kanto',
    name: '関東',
    prefectures: [8, 9, 10, 11, 12, 13, 14], // 茨城、栃木、群馬、埼玉、千葉、東京、神奈川
  },
  {
    id: 'hokuriku-shinetsu',
    name: '北陸/信越',
    prefectures: [15, 16, 17, 18, 19, 20], // 新潟、富山、石川、福井、山梨、長野
  },
  {
    id: 'chubu',
    name: '中部',
    prefectures: [21, 22, 23], // 岐阜、静岡、愛知
  },
  {
    id: 'kinki',
    name: '近畿',
    prefectures: [24, 25, 26, 27, 28, 29, 30], // 三重、滋賀、京都、大阪、兵庫、奈良、和歌山
  },
  {
    id: 'chugoku',
    name: '中国',
    prefectures: [31, 32, 33, 34, 35], // 鳥取、島根、岡山、広島、山口
  },
  {
    id: 'shikoku',
    name: '四国',
    prefectures: [36, 37, 38, 39], // 徳島、香川、愛媛、高知
  },
  {
    id: 'kyushu-okinawa',
    name: '九州/沖縄',
    prefectures: [40, 41, 42, 43, 44, 45, 46, 47], // 福岡、佐賀、長崎、熊本、大分、宮崎、鹿児島、沖縄
  },
];

export const REGION_POSITIONS: RegionPosition[] = [
  { id: 'hokkaido', position: 'top-[60px] right-[50px] w-[10%]' },
  { id: 'tohoku', position: 'top-[180px] right-[50px] w-[25%]' },
  { id: 'kanto', position: 'top-[340px] right-[50px] w-[25%]' },
  { id: 'hokuriku-shinetsu', position: 'top-0 left-[310px] w-[25%]' },
  { id: 'chubu', position: 'top-[570px] right-[100px] w-[17%]' },
  { id: 'kinki', position: 'top-[160px] left-[80px] w-[30%]' },
  { id: 'chugoku', position: 'top-[320px] left-[10px] w-[17%]' },
  { id: 'shikoku', position: 'top-[570px] right-[320px] w-[17%]' },
  { id: 'kyushu-okinawa', position: 'top-[520px] left-[10px] w-[17%]' },
];