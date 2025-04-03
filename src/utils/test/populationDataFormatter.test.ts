import {
  extractPopulationDataByType,
  formatPopulationDataForChart,
  removePopulationData
} from '../populationDataFormatter';
import { FormattedPopulationData } from '@/types/types';
import { POPULATION_TYPE_LABELS } from '@/types/constants';

// getPopulationTypeLabelのテストを削除し、代わりに定数を直接テスト
describe('POPULATION_TYPE_LABELS', () => {
  it('人口種別に対応するラベルが正しく定義されている', () => {
    expect(POPULATION_TYPE_LABELS.total).toBe('総人口');
    expect(POPULATION_TYPE_LABELS.young).toBe('年少人口');
    expect(POPULATION_TYPE_LABELS.working).toBe('生産年齢人口');
    expect(POPULATION_TYPE_LABELS.elderly).toBe('老年人口');
  });
});

describe('extractPopulationDataByType', () => {
  const mockPopulationData = {
    data: [
      {
        label: '総人口',
        data: [
          { year: 2015, value: 5000000 },
          { year: 2020, value: 4900000 },
        ],
      },
      {
        label: '年少人口',
        data: [
          { year: 2015, value: 600000 },
          { year: 2020, value: 550000 },
        ],
      },
    ],
  };

  it('指定した人口種別のデータを抽出する', () => {
    const result = extractPopulationDataByType(mockPopulationData, 'total');
    expect(result).toEqual([
      { year: 2015, value: 5000000 },
      { year: 2020, value: 4900000 },
    ]);

    const youngResult = extractPopulationDataByType(mockPopulationData, 'young');
    expect(youngResult).toEqual([
      { year: 2015, value: 600000 },
      { year: 2020, value: 550000 },
    ]);
  });

  it('存在しない人口種別を指定するとエラーをスローする', () => {
    expect(() => {
      extractPopulationDataByType(mockPopulationData, 'working');
    }).toThrow('人口種別「生産年齢人口」のデータが見つかりません');
  });
});

describe('formatPopulationDataForChart', () => {
  it('空の配列が渡された場合は空の配列を返す', () => {
    expect(formatPopulationDataForChart([])).toEqual([]);
  });

  it('複数の都道府県データをグラフ用に整形する', () => {
    const mockData: FormattedPopulationData[] = [
      {
        prefCode: 1,
        prefName: '北海道',
        data: [
          { year: 2015, value: 5000000 },
          { year: 2020, value: 4900000 },
        ],
      },
      {
        prefCode: 2,
        prefName: '青森県',
        data: [
          { year: 2015, value: 1300000 },
          { year: 2020, value: 1250000 },
        ],
      },
    ];

    const result = formatPopulationDataForChart(mockData);
    expect(result).toEqual([
      { year: 2015, '北海道': 5000000, '青森県': 1300000 },
      { year: 2020, '北海道': 4900000, '青森県': 1250000 },
    ]);
  });

  it('異なる年のデータを持つ都道府県も正しく処理する', () => {
    const mockData: FormattedPopulationData[] = [
      {
        prefCode: 1,
        prefName: '北海道',
        data: [
          { year: 2010, value: 5100000 },
          { year: 2015, value: 5000000 },
        ],
      },
      {
        prefCode: 2,
        prefName: '青森県',
        data: [
          { year: 2015, value: 1300000 },
          { year: 2020, value: 1250000 },
        ],
      },
    ];

    const result = formatPopulationDataForChart(mockData);
    expect(result).toEqual([
      { year: 2010, '北海道': 5100000 },
      { year: 2015, '北海道': 5000000, '青森県': 1300000 },
      { year: 2020, '青森県': 1250000 },
    ]);
  });
});

// isPrefectureSelectedテストを置き換える
describe('removePopulationData', () => {
  const mockData: FormattedPopulationData[] = [
    {
      prefCode: 1,
      prefName: '北海道',
      data: [],
    },
    {
      prefCode: 2,
      prefName: '青森県',
      data: [],
    },
  ];

  it('指定した都道府県を配列から削除する', () => {
    const result = removePopulationData(mockData, 1);
    expect(result).toHaveLength(1);
    expect(result[0].prefCode).toBe(2);
    expect(result[0].prefName).toBe('青森県');
  });

  it('存在しない都道府県コードを指定した場合は元の配列を返す', () => {
    const result = removePopulationData(mockData, 3);
    expect(result).toHaveLength(2);
  });

  // 追加のテスト：配列から削除後に特定のprefCodeがないことを確認
  it('削除後、指定した都道府県コードを持つデータが存在しないことを確認', () => {
    const result = removePopulationData(mockData, 1);
    const containsPref1 = result.some(item => item.prefCode === 1);
    expect(containsPref1).toBe(false);
  });
});