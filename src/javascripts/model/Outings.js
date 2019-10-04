import echarts from 'echarts/dist/echarts.min';
import moment from 'moment';
import 'moment-timezone';
import I18n from './I18n';

export default class Outings {
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

    const response = await fetch(`${this.config.api}/api/4/contracts/${this.config.contract.ref}/actimetry/outings?end=${end}&start=${start}&timezone=${this.config.contract.timezone}`, {
      headers: {
        authorization: `Basic ${this.config.credentials}`,
      },
      method: 'GET',
    });

    const outings = await response.json();

    this.checkForData(outings, element);
  }

  checkForData(outings, element) {
    const hasActivities = Object.values(outings).reduce((total, currentObj) => total + currentObj.length, 0) > 0;
    if (hasActivities) {
      this.initDataset(outings, element);
    } else {
      document.querySelector(element)
        .classList
        .remove('loading');

      document.querySelector(element).innerHTML = `<div class="actimetry__no-data">${I18n.strings[this.config.language].no_data}</div>`;
    }
  }

  initDataset(outings, element) {
    const dataset = [];
    const gfxConfig = {
      min: Number.MAX_SAFE_INTEGER,
      max: Number.MIN_SAFE_INTEGER,
    };

    Object.keys(outings)
      .forEach((theDate) => {
        dataset.push([theDate, outings[theDate].length, outings[theDate]]);

        if (outings[theDate].length < gfxConfig.min) {
          gfxConfig.min = outings[theDate].length;
        }
        if (outings[theDate].length > gfxConfig.max) {
          gfxConfig.max = outings[theDate].length;
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
        formatter(outings) {
          let tooltip = '';
          outings[0].data[2].forEach((outing, index) => {
            tooltip += `<b>${I18n.strings[self.config.language].outing} #${(index + 1)}</b> : ${I18n.strings[self.config.language].from} ${moment(outing.start)
              .tz(self.config.contract.timezone)
              .format('HH:mm')} ${I18n.strings[self.config.language].to} ${moment(outing.end)
              .tz(self.config.contract.timezone)
              .format('HH:mm')}<br>`;
          });

          return tooltip;
        },
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
              return moment(value)
                .format('DD/MM');
            },
          },
        },
      ],
      yAxis: {
        minInterval: 1,
        min: gfxConfig.min,
        max: gfxConfig.max + 1,
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
