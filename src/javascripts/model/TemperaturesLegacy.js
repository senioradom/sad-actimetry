/* global echarts */
/* global moment */

export default class TemperaturesLegacy {
  constructor(config) {
    this.config = config;
  }

  draw(element, type, start, end) {
    if (this.config.isReady) {
      this.fetchAndDraw(element, type, start, end);
    } else {
      document.addEventListener('actimetryIsReady', () => {
        this.fetchAndDraw(element, type, start, end);
      }, { once: true });
    }
  }

  async fetchAndDraw(element, type, start, end) {
    const response = await fetch(`${this.config.api}/api/4/contracts/${this.config.contract.ref}/actimetry/temperatures?end=${end}&start=${start}&timezone=${this.config.contract.timezone}`, {
      headers: {
        authorization: `Basic ${this.config.credentials}`,
      },
      method: 'GET',
    });

    const temperatures = await response.json();
    this.initDataset(temperatures, element, type);
  }

  initDataset(temperatures, element, type) {
    const dataset = [];
    const gfxConfig = {
      min: Number.MAX_SAFE_INTEGER,
      max: Number.MIN_SAFE_INTEGER,
    };

    Object.keys(temperatures)
      .forEach((theDate) => {
        Object.keys(temperatures[theDate])
          .forEach((key) => {
            if (temperatures[theDate][key].temp < gfxConfig.min) {
              gfxConfig.min = temperatures[theDate][key].temp;
            }
            if (temperatures[theDate][key].temp > gfxConfig.max) {
              gfxConfig.max = temperatures[theDate][key].temp;
            }
            dataset.push([temperatures[theDate][key].createdAt, temperatures[theDate][key].temp]);
          });
      });

    this.setOptions(dataset, gfxConfig, element, type);
  }

  setOptions(dataset, gfxConfig, element, type) {
    const myChart = echarts.init(document.querySelector(element));
    this.option = {
      /*
      title: {
        text: i18n.strings[this.config.contract.language][`temperatures_${type}`],
      },
      legend: {
        data: ['Temperature'],
      },
      */
      color: ['#81b41d'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: true,
        },
        formatter(value) {
          return `${moment(value[0].data[0]).format('HH:mm')} : ${value[0].data[1]}°C`;
        },
      },

      calculable: true,
      xAxis: [
        {
          type: 'time',
          interval: (type === 'week') ? 86400000 : 86400000 / 12,
          boundaryGap: false,
          axisLabel: {
            formatter(value) {
              return moment(value)
                .format((type === 'week') ? 'DD/MM' : 'HH');
            },
          },
        },
      ],
      yAxis: {
        type: 'value',
        min: parseInt(gfxConfig.min, 10) - 2,
        max: parseInt(gfxConfig.max, 10) + 2,
        axisLabel: {
          formatter: '{value} °C',
        },
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'empty',
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'empty',
        },
      ],
      series: [
        {
          showSymbol: false,
          name: 'Temperature',
          type: 'line',
          smooth: true,
          data: dataset,
        },
      ],
    };

    if (this.option && typeof this.option === 'object') {
      myChart.setOption(this.option, true);
    }
  }
}
