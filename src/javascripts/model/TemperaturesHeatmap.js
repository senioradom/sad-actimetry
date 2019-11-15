import echarts from 'echarts/dist/echarts.min';
import moment from 'moment';
import 'moment-timezone';
import I18n from './I18n';

export default class TemperaturesHeatmap {
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
    if (
      !this._config.contract ||
      document.querySelector(element) == null ||
      this._destroyRequest
    ) {
      return;
    }

    document.querySelector(element).classList.add('loading');

    const response = await fetch(
      `${this._config.api}/api/4/contracts/${this._config.contract.ref}/actimetry/temperatures?end=${end}&start=${start}&timezone=${this._config.contract.timezone}`,
      {
        headers: {
          authorization: `Basic ${this._config.credentials}`
        },
        method: 'GET'
      }
    );

    const temperatures = await response.json();

    this._checkForData(temperatures, element);
  }

  _checkForData(temperatures, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const hasActivities =
      Object.values(temperatures).reduce(
        (total, currentObj) => total + currentObj.length,
        0
      ) > 0;
    if (hasActivities) {
      this._initDataset(temperatures, element);
    } else {
      document.querySelector(element).classList.remove('loading');

      document.querySelector(
        element
      ).innerHTML = `<div class="actimetry__no-data">${
        I18n.strings[this._config.language].no_data
      }</div>`;
    }
  }

  _initDataset(temperatures, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    this._width = document.querySelector(element).offsetWidth;
    this._isMobile = document.defaultView.innerWidth <= 768;

    const self = this;

    const gfxConfig = {
      days: [],
      hours: []
    };

    let dataset = [];
    const temporaryTemperaturesObject = {};

    Object.keys(temperatures).forEach(theDate => {
      if (Object.prototype.hasOwnProperty.call(temperatures, theDate)) {
        if (
          !Object.prototype.hasOwnProperty.call(
            temporaryTemperaturesObject,
            theDate
          )
        ) {
          temporaryTemperaturesObject[theDate] = {};
          for (let hour = 0; hour <= 23; hour += 1) {
            temporaryTemperaturesObject[theDate][hour] = null;
          }
        }

        temperatures[theDate].forEach(value => {
          const currentHour = moment(value.createdAt)
            .tz(self._config.contract.timezone)
            .hour();
          temporaryTemperaturesObject[theDate][currentHour] = Math.max(
            temporaryTemperaturesObject[theDate][currentHour],
            Number(`${Math.round(`${value.temp}e2`)}e-2`)
          );
        });
      }
    });

    let dayIndex = 0;

    Object.keys(temporaryTemperaturesObject).forEach(theDate => {
      if (
        Object.prototype.hasOwnProperty.call(
          temporaryTemperaturesObject,
          theDate
        )
      ) {
        gfxConfig.days.push(
          moment(theDate)
            .tz(self._config.contract.timezone)
            // .locale('fr')
            .format(self._isMobile ? 'DD/MM' : 'dddd DD/MM')
        );

        Object.keys(temporaryTemperaturesObject[theDate]).forEach(hour => {
          if (
            Object.prototype.hasOwnProperty.call(
              temporaryTemperaturesObject[theDate],
              hour
            )
          ) {
            dataset.push([
              dayIndex,
              parseInt(hour, 10),
              temporaryTemperaturesObject[theDate][hour]
            ]);
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

    this._setOptions(dataset, gfxConfig, element);
  }

  _setOptions(dataset, gfxConfig, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const myChart = echarts.init(document.querySelector(element));
    const width = document.defaultView.innerWidth;

    let zoomLevel = 100;

    if (width <= 400) {
      zoomLevel = 20;
    } else if (width <= 768) {
      zoomLevel = 50;
    }

    this._option = {
      tooltip: {
        show: false
      },
      animation: false,
      grid: {
        right: 20,
        y: '0%',
        width: this._width - (this._isMobile ? 60 : 130),
        height: 500
      },
      xAxis: {
        type: 'category',
        data: gfxConfig.hours,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: gfxConfig.days,
        splitArea: {
          show: true
        }
      },
      dataZoom: [
        {
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          bottom: 20,
          y: 535,
          height: 10,
          borderColor: 'transparent',
          backgroundColor: '#e2e2e2',
          handleIcon:
            'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
          handleSize: 20,
          handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa'
          },
          labelFormatter: '',
          start: 0,
          end: zoomLevel
        },
        {
          type: 'inside',
          start: 0,
          end: zoomLevel
        }
      ],
      visualMap: [
        {
          min: 12,
          max: 30,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          y: 575,
          inRange: {
            color: [
              '#0A2CFF',
              '#006EFF',
              '#3D97FF',
              '#72B1FF',
              '#21DB9B',
              '#00FF00',
              '#2EFF00',
              '#F2FF00',
              '#FF9F00',
              '#FF7900',
              '#FF0000'
            ]
          },
          formatter(params) {
            return `${(params * 2).toFixed() / 2}°`;
          }
        },
        {
          type: 'piecewise',
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          show: false, // Hide legend
          bottom: '15%',
          pieces: [
            {
              lt: 12,
              label: '< 12',
              color: '#0A2CFF'
            },
            {
              lt: 14,
              gte: 12,
              label: '12 - 14',
              color: '#006EFF'
            },
            {
              gte: 14,
              lt: 16,
              label: '14 - 16',
              color: '#3D97FF'
            },
            {
              gte: 16,
              lt: 18,
              label: '16 - 18',
              color: '#72B1FF'
            },
            {
              gte: 18,
              lt: 20,
              label: '18 - 20',
              color: '#21DB9B'
            },
            {
              gte: 20,
              lt: 22,
              label: '20 - 22',
              color: '#00FF00'
            },
            {
              gte: 22,
              lt: 24,
              label: '22 - 24',
              color: '#2EFF00'
            },
            {
              gte: 24,
              lt: 26,
              label: '24 - 26',
              color: '#F2FF00'
            },
            {
              gte: 26,
              lt: 28,
              label: '26 - 28',
              color: '#FF9F00'
            },
            {
              gte: 28,
              lt: 30,
              label: '28 - 30',
              color: '#FF7900'
            },
            {
              gte: 30,
              label: '>= 30',
              color: '#FF0000'
            }
          ]
        }
      ],
      series: [
        {
          name: 'Temperature',
          type: 'heatmap',
          data: dataset,
          label: {
            normal: {
              formatter(params) {
                return `${params.value[2]}°`;
              },
              color: 'black',
              show: true
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
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
