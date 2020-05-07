import echarts from 'echarts/dist/echarts.min';
import moment from 'moment-timezone';
import I18n from './I18n';
import StringUtils from '../StringUtils';

export default class Sleeps {
  constructor(config) {
    this._config = config;
    this._destroyRequest = false;
  }

  draw(element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    if (this._config.isReady) {
      this._fetchAndDraw(element);
    } else {
      document.addEventListener(
        'actimetryIsReady',
        () => {
          this._fetchAndDraw(element);
        },
        { once: true }
      );
    }
  }

  stop() {
    this._destroyRequest = true;
  }

  async _fetchAndDraw(element) {
    if (!this._config.contract || document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    document.querySelector(element).classList.add('loading');

    // @todo : Plug to real data
    // const response = await fetch(`${this.config.api.actimetry}/contracts/${this.config.contract.ref}/actimetry/activities?end=${end}&start=${start}&timezone=${this.config.contract.timezone}`, {
    //   headers: {
    //     authorization: `Basic ${this.config.credentials}`,
    //   },
    //   method: 'GET',
    // });

    // const sleeps = await response.json();

    const sleeps = {
      data: {
        dates: [
          '2019-06-07T00:00:00+0200',
          '2019-06-08T00:00:00+0200',
          '2019-06-09T00:00:00+0200',
          '2019-06-10T00:00:00+0200',
          '2019-06-11T00:00:00+0200',
          '2019-06-12T00:00:00+0200',
          '2019-06-13T00:00:00+0200'
        ],
        sleepsDurations: ['PT7H19M27S', 'PT6H22M', 'PT8H29M22S', 'PT4H5M58S', 'PT7H51M56S', 'PT8H55M15S', 'PT5H3M52S'],
        sleepsDurationsDailyAverages: [
          'PT6H50M50S',
          'PT9H59M19S',
          'PT9H10M7S',
          'PT4H30M48S',
          'PT5H59M11S',
          'PT6H50M7S',
          'PT7H3M59S'
        ]
      }
    };

    this._initDataset(sleeps.data, element);
  }

  _initDataset(dataset, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const gfxConfig = {
      colors: ['#96bed8', '#639fa6']
    };

    dataset.sleepsDurations.forEach((value, key) => {
      dataset.sleepsDurations[key] = moment.duration(value).asMilliseconds();
    });

    dataset.sleepsDurationsDailyAverages.forEach((value, key) => {
      dataset.sleepsDurationsDailyAverages[key] = moment.duration(value).asMilliseconds();
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
      color: gfxConfig.colors,

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: true
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        extraCssText: 'box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2); padding:21px;',
        position(pos) {
          return {
            top: 10,
            left: pos[0]
          };
        },
        formatter(params) {
          let htmlTooltip = `
<div class="sleeps-tooltip">
<p class="header">Le ${moment(params[0].axisValue).format('DD/MM/YYYY')}</p>
`;
          htmlTooltip += `
<p>${I18n.strings[self._config.language].sleep_duration} : <strong>${StringUtils.formatDuration(
            moment.duration(params[0].value),
            false
          )}</strong></p>
<p>${I18n.strings[self._config.language].averages} ${moment(params[0].axisValue).format(
            'dddd'
          )} : <strong>${StringUtils.formatDuration(moment.duration(params[1].value), false)}</strong></p>
</div>
`;
          return htmlTooltip;
        }
      },
      grid: {
        right: '20%'
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            formatter(theDate) {
              return moment(theDate).format('DD/MM');
            }
          },
          data: dataset.dates
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#222'
            }
          },
          axisLabel: {
            formatter(value) {
              return StringUtils.roundHalfTime(value, self._config.contract.timezone);
            }
          }
        }
      ],
      series: [
        {
          type: 'bar',
          data: dataset.sleepsDurations
        },
        {
          type: 'line',
          data: dataset.sleepsDurationsDailyAverages
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
