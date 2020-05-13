import echarts from 'echarts/dist/echarts.min';
import moment from 'moment-timezone';
import StringUtils from '../StringUtils';

export default class DashboardTile1 {
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

    const response = await fetch(`${this._config.api}/api/4/contracts/${this._config.contract.ref}/actimetry/rooms-sleep?end=${end}&start=${start}&timezone=${this._config.contract.timezone}`, {
      headers: {
        authorization: `Basic ${this._config.credentials}`
      },
      method: 'GET'
    });

    const activitiesPerRoom = await response.json();

    this._checkForData(activitiesPerRoom, element);
  }

  _checkForData(activitiesPerRoom, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const hasActivities = Object.values(activitiesPerRoom).reduce((total, currentObj) => total + currentObj.rooms.length, 0) > 0;
    if (hasActivities) {
      this._initDataset(activitiesPerRoom, element);
    } else {
      document.querySelector(element).classList.remove('loading');

      document.querySelector(element).innerHTML = `<div class="actimetry__no-data">${this._translationService.translate('GLOBAL.NO_DATA')}</div>`;
    }
  }

  _initDataset(activitiesPerRoom, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const self = this;

    const roomIds = [];

    const gfxConfig = {
      rooms: [],
      xAxis: [],
      tooltips: {}
    };

    const rawDataset = [];

    Object.keys(activitiesPerRoom).forEach(theDate => {
      gfxConfig.xAxis.push(theDate);

      if (Object.prototype.hasOwnProperty.call(activitiesPerRoom, theDate)) {
        activitiesPerRoom[theDate].rooms.forEach(presence => {
          if (roomIds.indexOf(presence.room) === -1) {
            roomIds.push(presence.room);
          }

          if (!Object.prototype.hasOwnProperty.call(rawDataset, presence.room)) {
            rawDataset[presence.room] = [];
          }

          rawDataset[presence.room].push(moment.duration(presence.duration).valueOf());
        });
      }
    });

    roomIds.sort();

    const dataset = [];
    roomIds.forEach(roomId => {
      const roomLabel = self._config.contract.rooms.filter(room => room.id === roomId)[0].label;
      gfxConfig.rooms.push(roomLabel);

      dataset.push({
        name: roomLabel,
        type: 'line',
        data: rawDataset[roomId],
        smooth: true,
        showSymbol: false,
        lineStyle: {
          normal: {
            opacity: 0.5
          }
        }
      });
    });

    this._setOptions(dataset, gfxConfig, element);
  }

  _setOptions(dataset, gfxConfig, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const myChart = echarts.init(document.querySelector(element));

    const self = this;
    self._tooltips = gfxConfig.tooltips;

    this._option = {
      backgroundColor: '#fff',
      animation: false,
      legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 5,
        itemGap: 5,
        icon: 'bar',
        data: gfxConfig.rooms
      },
      axisPointer: {
        link: {
          xAxisIndex: 'all'
        },
        label: {
          backgroundColor: '#777'
        }
      },
      grid: {
        top: '2%',
        y: 0,
        y2: 75
      },
      xAxis: [
        {
          type: 'category',

          data: gfxConfig.xAxis,
          boundaryGap: false,
          axisLine: {
            onZero: false
          },
          splitLine: {
            show: false
          },
          min: 'dataMin',
          max: 'dataMax'
        }
      ],
      yAxis: [
        {
          min: 0,
          max(value) {
            let minutes = moment.duration(value.max).asMinutes() + 30;
            minutes = (Math.floor(minutes / 150) + 1) * 150;
            return moment.duration(minutes, 'minutes').asMilliseconds();
          },
          interval: 9000000,
          axisLabel: {
            formatter(value) {
              return StringUtils.formatDuration(value, false);
            }
          },
          splitArea: {
            show: true
          }
        }
      ],
      series: dataset
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
