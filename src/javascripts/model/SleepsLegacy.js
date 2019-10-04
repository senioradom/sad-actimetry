import echarts from 'echarts/dist/echarts.min';
import moment from 'moment';
import 'moment-timezone';
import I18n from './I18n';

export default class SleepsLegacy {
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

    const response = await fetch(`${this.config.api}/api/4/contracts/${this.config.contract.ref}/actimetry/sleeps?end=${end}&start=${start}&timezone=${this.config.contract.timezone}`, {
      headers: {
        authorization: `Basic ${this.config.credentials}`,
      },
      method: 'GET',
    });

    const sleeps = await response.json();

    this.checkForData(sleeps, element);
  }

  checkForData(sleeps, element) {
    const hasActivities = Object.values(sleeps).reduce((total, currentObj) => total + currentObj.details.length, 0) > 0;
    if (hasActivities) {
      this.initDataset(sleeps, element);
    } else {
      document.querySelector(element)
        .classList
        .remove('loading');

      document.querySelector(element).innerHTML = `<div class="actimetry__no-data">${I18n.strings[this.config.language].no_data}</div>`;
    }
  }

  initDataset(sleeps, element) {
    const dataset = [];
    const gfxConfig = {
      min: Number.MAX_SAFE_INTEGER,
      max: Number.MIN_SAFE_INTEGER,
    };

    Object.keys(sleeps)
      .forEach((theDate) => {
        const duration = (moment.duration(sleeps[theDate].duration)
          .valueOf() / (1000 * 60 * 60)) % 24;

        dataset.push([theDate, duration, sleeps[theDate]]);

        if (duration < gfxConfig.min) {
          gfxConfig.min = duration;
        }
        if (duration > gfxConfig.max) {
          gfxConfig.max = duration;
        }
      });

    this.setOptions(dataset, gfxConfig, element);
  }

  setOptions(dataset, gfxConfig, element) {
    const myChart = echarts.init(document.querySelector(element));
    const self = this;

    this.option = {
      color: ['#81b41d'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: true,
        },
        formatter(sleeps) {
          return `
          ${I18n.strings[self.config.language].bedtime} : ${moment(sleeps[0].data[2].start).tz(self.config.contract.timezone).format('HH:mm')}<br>
          ${I18n.strings[self.config.language].wakeup_time2} : ${moment(sleeps[0].data[2].end).tz(self.config.contract.timezone).format('HH:mm')}<br>
          ${sleeps[0].data[2].wakeNumber > 0 ? `${I18n.strings[self.config.language].wokeup_at} ${sleeps[0].data[2].wakeNumber} ${sleeps[0].data[2].wakeNumber > 1 ? `${I18n.strings[self.config.language].times}` : `${I18n.strings[self.config.language].time}`}` : `${I18n.strings[self.config.language].didnt_wake_up_at_night}`}<br>
          `;
        },
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
              return moment(value)
                .format('DD/MM');
            },
          },
        },
      ],
      yAxis: {
        minInterval: 1,
        min: parseInt(gfxConfig.min, 10),
        max: parseInt(gfxConfig.max, 10),
        type: 'value',
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
      series: [{
        data: dataset,
        type: 'bar',
      }],
    };

    if (this.option && typeof this.option === 'object') {
      myChart.setOption(this.option, true);

      document.querySelector(element)
        .classList
        .remove('loading');
    }
  }
}
