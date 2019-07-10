import echarts from 'echarts/dist/echarts.min';
import moment from 'moment';
import 'moment-timezone';

export default class TemperaturesHeatmap {
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

    const response = await fetch(`${this.config.api}/api/4/contracts/${this.config.contract.ref}/actimetry/temperatures?end=${end}&start=${start}&timezone=${this.config.contract.timezone}`, {
      headers: {
        authorization: `Basic ${this.config.credentials}`,
      },
      method: 'GET',
    });

    const temperatures = await response.json();

    this.initDataset(temperatures, element);
  }

  initDataset(temperatures, element) {
    const self = this;

    const gfxConfig = {
      days: [],
      hours: [],
    };

    let dataset = [];
    const temporaryTemperaturesObject = {};

    Object.keys(temperatures)
      .forEach((theDate) => {
        if (Object.prototype.hasOwnProperty.call(temperatures, theDate)) {
          if (!Object.prototype.hasOwnProperty.call(temporaryTemperaturesObject, theDate)) {
            temporaryTemperaturesObject[theDate] = {};
            for (let hour = 0; hour <= 23; hour += 1) {
              temporaryTemperaturesObject[theDate][hour] = null;
            }
          }

          temperatures[theDate]
            .forEach((value) => {
              const currentHour = moment(value.createdAt)
                .tz(self.config.contract.timezone)
                .hour();
              temporaryTemperaturesObject[theDate][currentHour] = Math.max(temporaryTemperaturesObject[theDate][currentHour], Number(`${Math.round(`${value.temp}e2`)}e-2`));
            });
        }
      });

    let dayIndex = 0;

    Object.keys(temporaryTemperaturesObject)
      .forEach((theDate) => {
        if (Object.prototype.hasOwnProperty.call(temporaryTemperaturesObject, theDate)) {
          gfxConfig.days.push(moment(theDate)
            .tz(self.config.contract.timezone)
            // .locale('fr')
            .format('dddd DD/MM'));

          Object.keys(temporaryTemperaturesObject[theDate])
            .forEach((hour) => {
              if (Object.prototype.hasOwnProperty.call(temporaryTemperaturesObject[theDate], hour)) {
                dataset.push([dayIndex, parseInt(hour, 10), temporaryTemperaturesObject[theDate][hour]]);
              }
            });

          dayIndex += 1;
        }
      });

    // 0 : Day
    // 1 : Hour
    // 2 : Temperature
    dataset = dataset.map(item => [item[1], item[0], item[2]]);

    for (let hour = 0; hour <= 23; hour += 1) {
      gfxConfig.hours.push(`${hour}h`);
    }

    this.setOptions(dataset, gfxConfig, element);
  }

  setOptions(dataset, gfxConfig, element) {
    const myChart = echarts.init(document.querySelector(element));

    this.option = {
      tooltip: {
        position: 'top',
        formatter: value => `${value.marker}${value.data[2]}°C`,
      },
      animation: false,
      grid: {
        height: '70%',
        y: '0%',
      },
      xAxis: {
        type: 'category',
        data: gfxConfig.hours,
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        data: gfxConfig.days,
        splitArea: {
          show: true,
        },
      },
      visualMap: [
        {
          min: 12,
          max: 30,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%',
          inRange: {
            color: ['#0A2CFF', '#006EFF', '#3D97FF', '#72B1FF', '#21DB9B', '#00FF00', '#2EFF00', '#F2FF00', '#FF9F00', '#FF7900', '#FF0000'],
          },
          formatter(params) {
            return `${params}°`;
          },
        },
        {
          type: 'piecewise',
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          show: false, // Hide legend
          bottom: '15%',
          pieces: [{
            lt: 12,
            label: '< 12',
            color: '#0A2CFF',
          },
          {
            lt: 14,
            gte: 12,
            label: '12 - 14',
            color: '#006EFF',
          },
          {
            gte: 14,
            lt: 16,
            label: '14 - 16',
            color: '#3D97FF',
          },
          {
            gte: 16,
            lt: 18,
            label: '16 - 18',
            color: '#72B1FF',
          },
          {
            gte: 18,
            lt: 20,
            label: '18 - 20',
            color: '#21DB9B',
          },
          {
            gte: 20,
            lt: 22,
            label: '20 - 22',
            color: '#00FF00',
          },
          {
            gte: 22,
            lt: 24,
            label: '22 - 24',
            color: '#2EFF00',
          },
          {
            gte: 24,
            lt: 26,
            label: '24 - 26',
            color: '#F2FF00',
          },
          {
            gte: 26,
            lt: 28,
            label: '26 - 28',
            color: '#FF9F00',
          },
          {
            gte: 28,
            lt: 30,
            label: '28 - 30',
            color: '#FF7900',
          },
          {
            gte: 30,
            label: '>= 30',
            color: '#FF0000',
          }],
        },
      ],
      series: [{
        name: 'Temperature',
        type: 'heatmap',
        data: dataset,
        label: {
          normal: {
            formatter(params) {
              return `${params.value[2]}°`;
            },
            color: 'black',
            show: true,
          },
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
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
