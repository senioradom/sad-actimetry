import echarts from 'echarts/dist/echarts.min';
import moment from 'moment';
import 'moment-timezone';
import I18n from './I18n';

export default class Activities {
  constructor(config) {
    this.config = config;
  }

  draw(element, start, end) {
    if (this.config.isReady) {
      this.fetchAndDraw(element, start, end);
    } else {
      document.addEventListener(
        'actimetryIsReady',
        () => {
          this.fetchAndDraw(element, start, end);
        },
        { once: true }
      );
    }
  }

  async fetchAndDraw(element, start, end) {
    document.querySelector(element).classList.add('loading');

    const response = await fetch(
      `${this.config.api}/api/4/contracts/${this.config.contract.ref}/actimetry/activities?end=${end}&start=${start}&timezone=${this.config.contract.timezone}`,
      {
        headers: {
          authorization: `Basic ${this.config.credentials}`
        },
        method: 'GET'
      }
    );

    const activities = await response.json();

    this.checkForData(activities, element);
  }

  checkForData(activities, element) {
    const hasActivities = activities.length > 0;
    if (hasActivities) {
      this.initDataset(activities, element);
    } else {
      document.querySelector(element).classList.remove('loading');

      document.querySelector(
        element
      ).innerHTML = `<div class="actimetry__no-data">${
        I18n.strings[this.config.language].no_data
      }</div>`;
    }
  }

  initDataset(activities, element) {
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

    this.setOptions(dataset, gfxConfig, element);
  }

  setOptions(dataset, gfxConfig, element) {
    const myChart = echarts.init(document.querySelector(element));
    this.option = {
      /*
      title: {
        text: i18n.strings[this.config.contract.language][`activities_${type}`],
      },
      legend: {
        data: ['Activities'],
      },
      */
      color: ['#81b41d'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: true
        },
        formatter(value) {
          return `${moment(value[0].data[0]).format('DD/MM HH:mm')} : ${
            value[0].data[1]
          }`;
        }
      },

      calculable: true,
      xAxis: [
        {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            formatter(value) {
              return moment(value).format('DD/MM HH:MM');
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

    if (this.option && typeof this.option === 'object') {
      myChart.setOption(this.option, true);

      document.querySelector(element).classList.remove('loading');
    }
  }
}
