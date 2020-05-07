import echarts from 'echarts/dist/echarts.min';
import moment from 'moment-timezone';
import I18n from './I18n';

export default class SleepsLegacy {
  constructor(config) {
    this._config = config;
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

    const response = await fetch(
      `${this._config.api}/api/4/contracts/${this._config.contract.ref}/actimetry/sleeps?end=${end}&start=${start}&timezone=${this._config.contract.timezone}`,
      {
        headers: {
          authorization: `Basic ${this._config.credentials}`
        },
        method: 'GET'
      }
    );

    const sleeps = await response.json();

    this._checkForData(sleeps, element);
  }

  _checkForData(sleeps, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const hasActivities = Object.values(sleeps).reduce((total, currentObj) => total + currentObj.details.length, 0) > 0;
    if (hasActivities) {
      this._initDataset(sleeps, element);
    } else {
      document.querySelector(element).classList.remove('loading');

      document.querySelector(element).innerHTML = `<div class="actimetry__no-data">${
        I18n.strings[this._config.language].no_data
      }</div>`;
    }
  }

  _initDataset(sleeps, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const dataset = [];
    const gfxConfig = {
      min: Number.MAX_SAFE_INTEGER,
      max: Number.MIN_SAFE_INTEGER
    };

    Object.keys(sleeps).forEach(theDate => {
      const duration = (moment.duration(sleeps[theDate].duration).valueOf() / (1000 * 60 * 60)) % 24;

      dataset.push([theDate, duration, sleeps[theDate]]);

      if (duration < gfxConfig.min) {
        gfxConfig.min = duration;
      }
      if (duration > gfxConfig.max) {
        gfxConfig.max = duration;
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
        formatter(sleeps) {
          return `
          ${I18n.strings[self._config.language].bedtime} : ${moment(sleeps[0].data[2].start)
            .tz(self._config.contract.timezone)
            .format('LT')}<br>
          ${I18n.strings[self._config.language].wakeup_time2} : ${moment(sleeps[0].data[2].end)
            .tz(self._config.contract.timezone)
            .format('LT')}<br>
          ${
            sleeps[0].data[2].wakeNumber > 0
              ? `${I18n.strings[self._config.language].wokeup_at} ${sleeps[0].data[2].wakeNumber} ${
                  sleeps[0].data[2].wakeNumber > 1
                    ? `${I18n.strings[self._config.language].times}`
                    : `${I18n.strings[self._config.language].time}`
                }`
              : `${I18n.strings[self._config.language].didnt_wake_up_at_night}`
          }<br>
          `;
        }
      },
      calculable: true,
      xAxis: [
        {
          nameLocation: 'end',
          interval: 86400000,
          type: 'category',
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
        min: 0,
        max: parseInt(gfxConfig.max, 10),
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
