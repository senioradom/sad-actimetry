import echarts from 'echarts/dist/echarts.min';
import moment from 'moment-timezone';
import outingsMock from '../mocks/outingsMock';

export default class Outings {
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

    let outings;
    if (this._config.isMocked) {
      outings = outingsMock;
    } else {
      const response = await fetch(`${this._config.api}/api/4/contracts/${this._config.contract.ref}/actimetry/outings?end=${end}&start=${start}&timezone=${this._config.contract.timezone}`, {
        headers: {
          authorization: `Basic ${this._config.credentials}`
        },
        method: 'GET'
      });

      outings = await response.json();
    }

    this._checkForData(outings, element);
  }

  _checkForData(outings, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const hasActivities = Object.values(outings).reduce((total, currentObj) => total + currentObj.length, 0) > 0;
    if (hasActivities) {
      this._initDataset(outings, element);
    } else {
      document.querySelector(element).classList.remove('loading');

      document.querySelector(element).innerHTML = `<div class="actimetry__no-data">${this._translationService.translate('GLOBAL.NO_DATA')}</div>`;
    }
  }

  _initDataset(outings, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const dataset = [];
    const gfxConfig = {
      min: 0,
      max: Number.MIN_SAFE_INTEGER
    };

    Object.keys(outings).forEach(theDate => {
      dataset.push([theDate, outings[theDate].length, outings[theDate]]);

      if (outings[theDate].length > gfxConfig.max) {
        gfxConfig.max = outings[theDate].length;
      }
    });

    this._setOptions(dataset, gfxConfig, element);
  }

  _setOptions(dataset, gfxConfig, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const myChart = echarts.init(document.querySelector(element));
    const self = this;

    this._option = {
      color: ['#81b41d'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: true
        },
        formatter(outings) {
          let tooltip = '';
          outings[0].data[2].forEach((outing, index) => {
            tooltip += `${self._translationService.translate('OUTINGS.OUTING_DETAILS', {
              number: index + 1,
              fromTime: moment(outing.start)
                .tz(self._config.contract.timezone)
                .format('LT'),
              toTime: moment(outing.end)
                .tz(self._config.contract.timezone)
                .format('LT')
            })}<br>`;
          });

          return tooltip;
        }
      },
      calculable: true,
      xAxis: [
        {
          nameLocation: 'end',
          interval: 86400000,
          // type: 'time',
          type: 'category',
          // boundaryGap: false,
          axisLabel: {
            nameLocation: 'end',
            formatter(value) {
              return moment(value).format('DD/MM');
            }
          }
        }
      ],
      yAxis: {
        minInterval: 1,
        min: gfxConfig.min,
        max: gfxConfig.max + 1,
        type: 'value'
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
          data: dataset,
          type: 'bar'
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
