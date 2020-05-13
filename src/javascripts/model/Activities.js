import echarts from 'echarts/dist/echarts.min';
import moment from 'moment-timezone';

export default class Activities {
  constructor(config, translationService) {
    this._config = config;
    this._translationService = translationService;

    this._destroyRequest = false;
  }

  draw(element, start, end) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    if (this._config.isReady) {
      this._fetchAndDraw(element, start, end);
    } else {
      document.addEventListener(
        'actimetryIsReady',
        () => {
          this._fetchAndDraw(element, start, end);
        },
        { once: true }
      );
    }
  }

  stop() {
    this._destroyRequest = true;
  }

  async _fetchAndDraw(element, start, end) {
    if (!this._config.contract || document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    document.querySelector(element).classList.add('loading');

    const response = await fetch(`${this._config.api}/api/4/contracts/${this._config.contract.ref}/actimetry/activities?end=${end}&start=${start}&timezone=${this._config.contract.timezone}`, {
      headers: {
        authorization: `Basic ${this._config.credentials}`
      },
      method: 'GET'
    });

    const activities = await response.json();

    this._checkForData(activities, element);
  }

  _checkForData(activities, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const hasActivities = activities.length > 0;
    if (hasActivities) {
      this._initDataset(activities, element);
    } else {
      document.querySelector(element).classList.remove('loading');

      document.querySelector(element).innerHTML = `<div class="actimetry__no-data">${this._translationService.translate('GLOBAL.NO_DATA')}</div>`;
    }
  }

  _initDataset(activities, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const dataset = [];
    const gfxConfig = {
      min: 0,
      max: 0
    };

    Object.keys(activities).forEach(theDate => {
      Object.keys(activities[theDate]).forEach(() => {
        gfxConfig.max = Math.max(gfxConfig.max, activities[theDate].value);
        dataset.push([activities[theDate].start, activities[theDate].value]);
      });
    });

    this._setOptions(dataset, gfxConfig, element);
  }

  _setOptions(dataset, gfxConfig, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const myChart = echarts.init(document.querySelector(element));
    this._option = {
      color: ['#81b41d'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: true
        },
        formatter(value) {
          return `${moment(value[0].data[0]).format('L LT')} : ${value[0].data[1]}`;
        }
      },

      calculable: true,
      xAxis: [
        {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            formatter(value) {
              return moment(value).format('L LT');
            }
          }
        }
      ],
      yAxis: {
        type: 'value',
        min: parseInt(gfxConfig.min, 10),
        max: parseInt(gfxConfig.max, 10) + 2,
        axisLabel: {
          formatter: '{value}'
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
          name: 'Activities',
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
