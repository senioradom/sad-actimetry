/* global echarts */
/* global moment */

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
    const response = await fetch(`${this.config.api.actimetry}/contracts/${this.config.contract.ref}/actimetry/sleeps?end=${end}&start=${start}&timezone=${this.config.contract.timezone}`, {
      headers: {
        authorization: `Basic ${this.config.credentials}`,
      },
      method: 'GET',
    });

    const sleeps = await response.json();
    this.initDataset(sleeps, element);
  }

  initDataset(sleeps, element) {
    const dataset = [];
    const gfxConfig = {
      min: Number.MAX_SAFE_INTEGER,
      max: Number.MIN_SAFE_INTEGER,
    };

    Object.keys(sleeps.data)
      .forEach((theDate) => {
        const duration = (moment.duration(sleeps.data[theDate].duration)
          .valueOf() / (1000 * 60 * 60)) % 24;

        dataset.push([theDate, duration, sleeps.data[theDate]]);

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
          Heure de couché : ${moment(sleeps[0].data[2].start).tz(self.config.contract.timezone).format('HH:mm')}<br>
          Heure de levé : ${moment(sleeps[0].data[2].end).tz(self.config.contract.timezone).format('HH:mm')}<br>
          ${sleeps[0].data[2].wakeNumber > 0 ? `S'est levé(e) à ${sleeps[0].data[2].wakeNumber} reprise${sleeps[0].data[2].wakeNumber > 1 ? 's' : ''}` : 'Pas de levé pendant la nuit'}<br>
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
    }
  }
}
