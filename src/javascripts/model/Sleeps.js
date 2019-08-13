import echarts from 'echarts/dist/echarts.min';
import moment from 'moment';
import 'moment-timezone';
import I18n from './I18n';

export default class Sleeps {
  constructor(config) {
    this.config = config;
  }

  draw(element, start, end) {
    if (this.config.isReady) {
      this.fetchAndDraw(element, start, end);
    } else {
      document.addEventListener('actimetryIsReady', () => {
        this.fetchAndDraw(element, start, end);
      }, { once: true });
    }
  }

  async fetchAndDraw(element, start, end) {
    document.querySelector(element)
      .classList
      .add('loading');

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
        dates: ['2019-06-07T00:00:00+0200', '2019-06-08T00:00:00+0200', '2019-06-09T00:00:00+0200', '2019-06-10T00:00:00+0200', '2019-06-11T00:00:00+0200', '2019-06-12T00:00:00+0200', '2019-06-13T00:00:00+0200'],
        sleepsDurations: ['PT7H19M27S', 'PT6H22M', 'PT8H29M22S', 'PT4H5M58S', 'PT7H51M56S', 'PT8H55M15S', 'PT5H3M52S'],
        sleepsDurationsDailyAverages: ['PT6H50M50S', 'PT9H59M19S', 'PT9H10M7S', 'PT4H30M48S', 'PT5H59M11S', 'PT6H50M7S', 'PT7H3M59S'],
      },
    };

    this.initDataset(sleeps.data, element);
  }

  initDataset(dataset, element) {
    const gfxConfig = {
      colors: ['#96bed8', '#639fa6'],
    };

    dataset.sleepsDurations.forEach((value, key) => {
      dataset.sleepsDurations[key] = moment.utc(moment.duration(value)
        .as('milliseconds'))
        .valueOf();
    });

    dataset.sleepsDurationsDailyAverages.forEach((value, key) => {
      dataset.sleepsDurationsDailyAverages[key] = moment.utc(moment.duration(value)
        .as('milliseconds'))
        .valueOf();
    });

    this.setOptions(dataset, gfxConfig, element);
  }

  setOptions(dataset, gfxConfig, element) {
    const myChart = echarts.init(document.querySelector(element));

    const self = this;

    this.option = {
      color: gfxConfig.colors,

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: true,
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        extraCssText: 'box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2); padding:21px;',
        position(pos) {
          return {
            top: 10,
            left: pos[0],
          };
        },
        formatter(params) {
          let htmlTooltip = `
<div class="sleeps-tooltip">
<p class="header">Le ${moment(params[0].axisValue)
    .format('DD/MM/YYYY')}</p>
`;
          htmlTooltip += `
<p>${I18n.strings[self.config.language].sleep_duration} : <strong>${moment.utc(moment.duration(params[0].value)
  .as('milliseconds'))
  .format('HH[h]mm')}</strong></p>
<p>${I18n.strings[self.config.language].averages} ${moment(params[0].axisValue)
  .format('dddd')} : <strong>${moment(params[1].value)
  .format('HH[h]mm')}</strong></p>
</div>
`;
          return htmlTooltip;
        },
      },
      grid: {
        right: '20%',
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            formatter(theDate) {
              return moment(theDate)
                .format('DD/MM');
            },
          },
          data: dataset.dates,
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#222',
            },
          },
          axisLabel: {
            formatter(value) {
              let roundedMinutes = Math.floor(moment.utc(moment.duration(value)
                .as('milliseconds'))
                .minute() / 30) * 30;

              if (!roundedMinutes) {
                roundedMinutes = '00';
              }

              return moment.utc(moment.duration(value)
                .as('milliseconds'))
                .format(`HH[h${roundedMinutes}]`);
            },
          },
        },
      ],
      series: [
        {
          type: 'bar',
          data: dataset.sleepsDurations,
        },
        {
          type: 'line',
          data: dataset.sleepsDurationsDailyAverages,
        },
      ],
    };

    if (this.option && typeof this.option === 'object') {
      myChart.setOption(this.option, true);

      document.querySelector(element)
        .classList
        .remove('loading');
    }
  }
}
