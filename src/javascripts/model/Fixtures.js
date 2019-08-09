import echarts from 'echarts/dist/echarts.min';

export default class Fixtures {
  constructor(config) {
    this.config = config;
  }

  draw(element) {
    const myChart = echarts.init(document.querySelector(element));

    this.option = {
      tooltip: {
        trigger: 'axis',
        showContent: false,
      },
      yAxis: [{
        scale: true,
        axisLabel: {
          formatter: '{value}h',
        },
        splitArea: {
          show: true,
        },
      },
      {
        scale: true,
        gridIndex: 0,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      ],

      legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 10,
        icon: 'bar',
        itemGap: 20,
        data: [
          'Bureau', 'Cuisine', 'Salle de bain', 'Sorties',
        ],
      },
      dataset: {
        source: [
          ['Room', '2019-08-01', '2019-08-02', '2019-08-03', '2019-08-04', '2019-08-05', '2019-08-06'],
          ['Bureau', 3, 4, 2, 2, 2.5, 3],
          ['Cuisine', 6, 6.5, 4, 5, 6.5, 6],
          ['Salle de bain', 4, 4, 4.5, 3.5, 2, 2.5],
          ['Sorties', 1, 6, 2, 1, 0, 5],
        ],
      },
      xAxis: {
        type: 'category',
      },
      grid: {
        top: '0%',
      },
      series: [{
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
      },
      ],
    };

    if (this.option && typeof this.option === 'object') {
      myChart.setOption(this.option, true);
    }
  }
}
