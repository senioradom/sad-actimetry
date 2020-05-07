import echarts from 'echarts/dist/echarts.min';
import moment from 'moment-timezone';
import I18n from './I18n';
import StringUtils from '../StringUtils';

export default class PresencesAndSleep {
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
      `${this._config.api}/api/4/contracts/${this._config.contract.ref}/actimetry/rooms-sleep?end=${end}&start=${start}&timezone=${this._config.contract.timezone}`,
      {
        headers: {
          authorization: `Basic ${this._config.credentials}`
        },
        method: 'GET'
      }
    );

    const roomsAndSleeps = await response.json();

    this._checkForData(roomsAndSleeps, element);
  }

  _checkForData(roomsAndSleeps, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const hasActivities =
      Object.values(roomsAndSleeps).reduce((total, currentObj) => total + currentObj.rooms.length, 0) > 0;
    if (hasActivities) {
      this._initDataset(roomsAndSleeps, element);
    } else {
      document.querySelector(element).classList.remove('loading');

      document.querySelector(element).innerHTML = `<div class="actimetry__no-data">${
        I18n.strings[this._config.language].no_data
      }</div>`;
    }
  }

  _initDataset(roomsAndSleeps, element) {
    this._width = document.querySelector(element).offsetWidth;

    const self = this;

    const roomIds = [];

    const gfxConfig = {
      rooms: [],
      xAxis: [],
      tooltips: {}
    };

    const rawDataset = {
      rooms: [],
      sleep: []
    };

    Object.keys(roomsAndSleeps).forEach(theDate => {
      gfxConfig.xAxis.push(theDate);

      if (Object.prototype.hasOwnProperty.call(roomsAndSleeps, theDate)) {
        roomsAndSleeps[theDate].rooms.forEach(presence => {
          if (roomIds.indexOf(presence.room) === -1) {
            roomIds.push(presence.room);
          }

          if (!Object.prototype.hasOwnProperty.call(rawDataset.rooms, presence.room)) {
            rawDataset.rooms[presence.room] = [];
          }

          rawDataset.rooms[presence.room].push(moment.duration(presence.duration).valueOf());
        });
      }

      if (roomsAndSleeps[theDate].sleep) {
        rawDataset.sleep.push(moment.duration(roomsAndSleeps[theDate].sleep.duration).valueOf());

        gfxConfig.tooltips[theDate] = roomsAndSleeps[theDate].sleep;
      } else {
        rawDataset.sleep.push(0);

        gfxConfig.tooltips[theDate] = null;
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
        data: rawDataset.rooms[roomId],
        smooth: true,
        lineStyle: {
          normal: {
            opacity: 0.5
          }
        }
      });
    });

    dataset.push({
      name: I18n.strings[this._config.language].sleep,
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      itemStyle: {
        normal: {
          color: '#87c540'
        }
      },
      data: rawDataset.sleep
    });

    this._setOptions(dataset, gfxConfig, element);
  }

  _setOptions(dataset, gfxConfig, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const myChart = echarts.init(document.querySelector(element));

    const coordonates = {
      width: this._width - 90,
      linesChart: {
        y: 10,
        height: 377
      },
      title: {
        top: 430
      },
      barsChart: {
        top: 480,
        height: 61
      },
      legend: {
        y: 555
      }
    };

    const self = this;
    self._tooltips = gfxConfig.tooltips;

    this._option = {
      color: [
        '#2f4f4f',
        '#228b22',
        '#00008b',
        '#b03060',
        '#ff4500',
        '#ffff00',
        '#00ff00',
        '#00ffff',
        '#ff00ff',
        '#ffdead',
        '#006400',
        '#00008b',
        '#b03060',
        '#ff4500',
        '#ffff00',
        '#deb887',
        '#00ff00',
        '#00ffff',
        '#ff00ff',
        '#6495ed'
      ],

      backgroundColor: '#fff',

      animation: true,
      legend: {
        orient: 'horizontal',
        x: 'center',
        y: coordonates.legend.y,
        padding: 5,
        itemGap: 5,
        icon: 'bar',
        data: gfxConfig.rooms
      },
      title: {
        text: I18n.strings[self._config.language].daily_sleep_duration,
        textStyle: {
          color: '#222',
          fontWeight: 'normal',
          fontSize: 24
        },
        top: coordonates.title.top,
        left: 'center'
      },
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
          const activites = params.filter(serie => serie.seriesType === 'line');
          let sleep = params.filter(serie => serie.seriesType === 'bar');

          sleep = self._tooltips[sleep[0].axisValue];

          let htmlTooltip = `<div class="presences-and-sleep-tooltip">
          <p style="font-weight:bold;color: #00827d;font-size:14px;">
          ${moment(params[0].name, 'YYYY-MM-DD').format('DD/MM/YYYY')}
          </p>
          <p class="header header--activities">
          <i class="icon-activities"></i> ${I18n.strings[self._config.language].presences}
          </p>`;
          activites.forEach(item => {
            htmlTooltip += `<p>${item.seriesName}: <strong>${StringUtils.formatDuration(
              item.data,
              false
            )}</strong></p>`;
          });

          if (sleep) {
            htmlTooltip += `
            <p class="header header--sleeps">
            <i class="icon-sleeps"></i> ${I18n.strings[self._config.language].sleep}
            </p>
            <p>${I18n.strings[self._config.language].duration} : <strong>${StringUtils.formatDuration(
              sleep.duration,
              false
            )}</strong></p>
            <p>${I18n.strings[self._config.language].bedtime} : <strong>${moment(sleep.start).format('LT')}</strong></p>
            <p>${I18n.strings[self._config.language].wakeup_time} : <strong>${moment(sleep.end).format(
              'LT'
            )}</strong></p>
            <p>${I18n.strings[self._config.language].number_of_wakeups_during_the_night} : <strong>${
              sleep.wakeNumber
            }</strong></p>
            </div>`;
          }

          return htmlTooltip;
        }
      },
      axisPointer: {
        link: {
          xAxisIndex: 'all'
        },
        label: {
          backgroundColor: '#777'
        }
      },
      grid: [
        {
          x: 'center',
          y: coordonates.linesChart.y,
          height: coordonates.linesChart.height,
          width: coordonates.width
        },
        {
          x: 'center',
          top: coordonates.barsChart.top,
          height: coordonates.barsChart.height,
          width: coordonates.width
        }
      ],
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
        },
        {
          type: 'category',
          gridIndex: 1,
          data: gfxConfig.xAxis,
          axisLine: {
            onZero: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
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
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
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
