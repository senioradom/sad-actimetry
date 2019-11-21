import echarts from 'echarts/dist/echarts.min';
import moment from 'moment';
import 'moment-timezone';

export default class TemperaturesLegacy {
  constructor(config) {
    this._config = config;
    this._destroyRequest = false;
  }

  _draw(element, type, start, end) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    if (this._config.isReady) {
      this._fetchAndDraw(element, type, start, end);
    } else {
      document.addEventListener(
        'actimetryIsReady',
        () => {
          this._fetchAndDraw(element, type, start, end);
        },
        { once: true }
      );
    }
  }

  stop() {
    this._destroyRequest = true;
  }

  async _fetchAndDraw(element, type, start, end) {
    if (!this._config.contract || document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    document.querySelector(element).classList.add('loading');

    const response = await fetch(
      `${this._config.api}/api/4/contracts/${this._config.contract.ref}/actimetry/temperatures?end=${end}&start=${start}&timezone=${this._config.contract.timezone}`,
      {
        headers: {
          authorization: `Basic ${this._config.credentials}`
        },
        method: 'GET'
      }
    );

    const temperatures = await response.json();
    this._initDataset(temperatures, element, type);
  }

  _initDataset(temperatures, element, type) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const dataset = [];
    const gfxConfig = {
      min: Number.MAX_SAFE_INTEGER,
      max: Number.MIN_SAFE_INTEGER
    };

    Object.keys(temperatures).forEach(theDate => {
      Object.keys(temperatures[theDate]).forEach(key => {
        if (temperatures[theDate][key].temp < gfxConfig.min) {
          gfxConfig.min = temperatures[theDate][key].temp;
        }
        if (temperatures[theDate][key].temp > gfxConfig.max) {
          gfxConfig.max = temperatures[theDate][key].temp;
        }
        dataset.push([temperatures[theDate][key].createdAt, temperatures[theDate][key].temp]);
      });
    });

    this._setOptions(dataset, gfxConfig, element, type);
  }

  _setOptions(dataset, gfxConfig, element, type) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const myChart = echarts.init(document.querySelector(element));
    this._option = {
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
          animation: true
        },
        formatter(value) {
          return `${moment(value[0].data[0]).format('HH:mm')} : ${value[0].data[1]}°C`;
        }
      },

      calculable: true,
      xAxis: [
        {
          type: 'time',
          interval: type === 'week' ? 86400000 : 86400000 / 12,
          boundaryGap: false,
          axisLabel: {
            formatter(value) {
              return moment(value).format(type === 'week' ? 'DD/MM' : 'HH');
            }
          }
        }
      ],
      yAxis: {
        type: 'value',
        min: parseInt(gfxConfig.min, 10) - 2,
        max: parseInt(gfxConfig.max, 10) + 2,
        axisLabel: {
          formatter: '{value} °C'
        }
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'empty'
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'empty'
        }
      ],
      series: [
        {
          showSymbol: false,
          name: 'Temperature',
          type: 'line',
          smooth: true,
          data: dataset
        }
      ]
    };

    if (this._option && typeof this._option === 'object') {
      if (document.querySelector(element) == null || this._destroyRequest) {
        return;
      }

      myChart.setOption(this._option, true);

      document.querySelector(element).classList.remove('loading');
    }
  }
}
