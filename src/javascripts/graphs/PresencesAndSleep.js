import echarts from 'echarts/dist/echarts.min';
import moment from 'moment-timezone';
import StringUtils from '../utils/StringUtils';
import roomsSleepMock from '../mocks/roomsSleepMock';

export default class PresencesAndSleep {
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

    let roomsAndSleeps;
    if (this._config.isMocked) {
      roomsAndSleeps = roomsSleepMock;
    } else {
      const response = await fetch(`${this._config.api}/api/4/contracts/${this._config.contract.ref}/actimetry/rooms-sleep?end=${end}&start=${start}&timezone=${this._config.contract.timezone}`, {
        headers: {
          authorization: `Basic ${this._config.credentials}`
        },
        method: 'GET'
      });

      roomsAndSleeps = await response.json();
    }

    this._checkForData(roomsAndSleeps, element);
  }

  _checkForData(roomsAndSleeps, element) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const hasActivities = Object.values(roomsAndSleeps).reduce((total, currentObj) => total + currentObj.rooms.length, 0) > 0;
    if (hasActivities) {
      this._initDataset(roomsAndSleeps, element);
    } else {
      document.querySelector(element).classList.remove('loading');

      document.querySelector(element).innerHTML = `<div class="actimetry__no-data">${this._translationService.translate('GLOBAL.NO_DATA')}</div>`;
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
      name: this._translationService.translate('PRESENCES_AND_SLEEPS.SLEEP'),
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
        text: self._translationService.translate('PRESENCES_AND_SLEEPS.DAILY_SLEEP_DURATION'),
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
        extraCssText: 'box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2); padding: 21px;',
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
            <p class="presences-and-sleep-tooltip__date">
              ${moment(params[0].name, 'YYYY-MM-DD').format('DD/MM/YYYY')}
            </p>
            <p class="header header--activities">
                <i class="icon-activities"></i> ${self._translationService.translate('PRESENCES_AND_SLEEPS.PRESENCES')}
            </p>
          `;

          activites.forEach(item => {
            htmlTooltip += `
                <p>${item.seriesName}:
                    <strong>${StringUtils.formatDuration(item.data, false)}</strong>
                </p>`;
          });

          if (sleep) {
            htmlTooltip += `
            <p class="header header--sleeps">
                <i class="icon-sleeps"></i> ${self._translationService.translate('PRESENCES_AND_SLEEPS.SLEEP')}
            </p>
            <p>
                ${self._translationService.translate('PRESENCES_AND_SLEEPS.DURATION', {
                  duration: StringUtils.formatDuration(sleep.duration, false)
                })}
            </p>

            <p>
                ${self._translationService.translate('GLOBAL.BEDTIME', {
                  time: moment(sleep.start).format('LT')
                })}
            </p>

            <p>
                ${self._translationService.translate('GLOBAL.WAKE_UP_TIME', {
                  time: moment(sleep.end).format('LT')
                })}
            </p>

            <p>
                ${self._translationService.translate('PRESENCES_AND_SLEEPS.NUMBER_OF_WAKEUPS_OVERNIGHT', {
                  number: sleep.wakeNumber
                })}
            </p>
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
