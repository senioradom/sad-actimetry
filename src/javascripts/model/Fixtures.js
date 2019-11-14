import echarts from 'echarts/dist/echarts.min';

export default class Fixtures {
  constructor(config) {
    this._config = config;
    this._destroyRequest = false;
  }

  draw(element) {
    if (this._destroyRequest) {
      return;
    }

    if (this._config.isReady) {
      this.draw2(element);
    } else {
      document.addEventListener(
        'actimetryIsReady',
        () => {
          this.draw2(element);
        },
        { once: true }
      );
    }
  }

  stop() {
    this._destroyRequest = true;
  }

  draw2(element) {
    if (this._destroyRequest) {
      return;
    }

    const myChart = echarts.init(document.querySelector(element));

    this._option = {
      tooltip: {
        trigger: 'axis',
        showContent: false
      },
      yAxis: [
        {
          scale: true,
          axisLabel: {
            formatter: '{value}h'
          },
          splitArea: {
            show: true
          }
        },
        {
          scale: true,
          gridIndex: 0,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],

      legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 5,
        itemGap: 5,
        icon: 'bar',
        data: [
          'Pièce 1',
          'Pièce 2',
          'Pièce 3',
          'Pièce 4',
          'Pièce 5',
          'Pièce 6',
          'Pièce 7',
          'Pièce 8'
        ]
      },
      dataset: {
        source: [
          [
            'Room',
            '2019-08-01',
            '2019-08-02',
            '2019-08-03',
            '2019-08-04',
            '2019-08-05',
            '2019-08-06',
            '2019-08-07'
          ],
          ['Pièce 1', 10, 3, 6, 9, 10, 10, 12],
          ['Pièce 2', 11, 6, 8, 5, 12, 7, 4],
          ['Pièce 3', 9, 10, 9, 10, 1, 3, 9],
          ['Pièce 4', 4, 10, 3, 5, 8, 3, 2],
          ['Pièce 5', 3, 9, 12, 2, 4, 12, 1],
          ['Pièce 6', 0, 6, 7, 3, 5, 3, 6],
          ['Pièce 7', 0, 4, 0, 3, 12, 12, 8],
          ['Pièce 8', 4, 4, 10, 2, 3, 5, 12]
        ]
      },
      xAxis: {
        type: 'category'
      },
      grid: {
        top: '2%',
        y: 0,
        y2: 75
      },
      series: [
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        },
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        },
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        },
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        },
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        },
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        },
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        },
        {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row'
        }
      ]
    };

    if (this._option && typeof this._option === 'object') {
      if (this._destroyRequest) {
        return;
      }

      myChart.setOption(this._option, true);
    }
  }
}
