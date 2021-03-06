import echarts from 'echarts/dist/echarts.min';
import moment from 'moment-timezone';
import StringUtils from '../utils/StringUtils';

export default class Presences {
  constructor(config, translationService) {
    this._config = config;
    this._translationService = translationService;

    this._destroyRequest = false;
  }

  draw(element, start, end, options, callback) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    this._options = options;

    if (this._config.isReady) {
      this._fetchAndDraw(element, start, end, callback);
    } else {
      document.addEventListener(
        'actimetryIsReady',
        () => {
          this._fetchAndDraw(element, start, end, callback);
        },
        { once: true }
      );
    }
  }

  zoom(fromTimestamp, toTimestamp) {
    if (this._chart) {
      this._chart.dispatchAction({
        type: 'dataZoom',
        dataZoomIndex: 0,
        startValue: fromTimestamp,
        endValue: toTimestamp
      });
    }
  }

  stop() {
    this._destroyRequest = true;
  }

  async _fetchAndDraw(element, start, end, callback) {
    if (!this._config.contract || document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    document.querySelector(element).classList.add('loading');

    const rangesResponse = await fetch(`${this._config.api}/api/4/contracts/${this._config.contract.ref}/actimetry/ranges?end=${end}&start=${start}&timezone=${this._config.contract.timezone}`, {
      headers: {
        authorization: `Basic ${this._config.credentials}`
      },
      method: 'GET'
    });

    const ranges = await rangesResponse.json();

    if (this._options.isAdminTicksMode) {
      const startAsUTC = moment(start)
        .tz(this._config.contract.timezone)
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss');

      const endAsUTC = moment(end)
        .tz(this._config.contract.timezone)
        .endOf('day')
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss');

      const ticksResponse = await fetch(`${this._config.api}/api/4/contracts/${this._config.contract.ref}/actimetry/ticks?end=${endAsUTC}Z&start=${startAsUTC}Z`, {
        headers: {
          authorization: `Basic ${this._config.credentials}`
        },
        method: 'GET'
      });

      this._options.ticks = await ticksResponse.json();
    }

    this._checkForData(ranges, element, callback);
  }

  _checkForData(ranges, element, callback) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const hasActivities = Object.values(ranges.days).reduce((total, currentObj) => total + currentObj.activities.length, 0) > 0;
    if (hasActivities) {
      this._initDataset(ranges, element, callback);
    } else {
      document.querySelector(element).classList.remove('loading');

      document.querySelector(element).innerHTML = `<div class="actimetry__no-data">${this._translationService.translate('GLOBAL.NO_DATA')}</div>`;

      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  }

  _initDataset(ranges, element, callback) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    this._width = document.querySelector(element).offsetWidth;
    this._isMobile = this._width <= 768;

    const gfxConfig = {
      min: Number.MAX_SAFE_INTEGER,
      max: Number.MIN_SAFE_INTEGER
    };

    const rooms = this._sortRooms();
    gfxConfig.rooms = rooms.sorted;
    gfxConfig.roomsMapping = rooms.mapping;

    let dataset = this._rangesToPresences(ranges, gfxConfig);
    if (this._options.isAdminTicksMode) {
      dataset.push(...this._ticksToPresences(this._options.ticks, gfxConfig));
    }

    dataset = this._renameRoomsAndAddMask(dataset, gfxConfig, moment(ranges.lastUpdate).valueOf());

    gfxConfig.zoomLevel = this._zoomLevel(gfxConfig.min, gfxConfig.max);

    this._setOptions(dataset, gfxConfig, element, callback);
  }

  _setOptions(dataset, gfxConfig, element, callback) {
    if (document.querySelector(element) == null || this._destroyRequest) {
      return;
    }

    const self = this;
    const isHeightSupplied = Object.prototype.hasOwnProperty.call(this._options, 'height') && this._options.height;

    let graphHeight;
    if (isHeightSupplied) {
      graphHeight = this._options.height;
    } else {
      graphHeight = 35 * gfxConfig.rooms.length;
    }

    document.querySelector(element).setAttribute('style', `${document.querySelector(element).getAttribute('style')}; height: ${isHeightSupplied ? graphHeight + 35 : graphHeight + 140}px;`);

    this._chart = echarts.init(document.querySelector(element));

    const legendsLeftBlock = this._isMobile ? 90 : 150;

    function renderItem(params, api) {
      const heightRatio = api.value(3) === 'MASK' ? 1 : 0.6;

      const categoryIndex = api.value(0);
      const start = api.coord([api.value(1), categoryIndex]);
      const end = api.coord([api.value(2), categoryIndex]);
      const height = api.size([0, 1])[1] * heightRatio;

      const rectShape = echarts.graphic.clipRectByRect(
        {
          x: start[0],
          y: start[1] - height / 2,
          width: end[0] - start[0],
          height
        },
        {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height
        }
      );

      return (
        rectShape && {
          type: 'rect',
          shape: rectShape,
          style: api.style(),
          styleEmphasis: api.styleEmphasis()
        }
      );
    }

    this._option = {
      progressive: dataset.length > 2999 ? 0 : 1,
      tooltip: {
        axisPointer: {
          type: 'shadow'
        },
        formatter(params) {
          return params.value[3] === 'MASK' ? undefined : params.value[3];
        }
      },
      dataZoom: [
        {
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          top: graphHeight + 100,
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
          start: gfxConfig.zoomLevel,
          end: 100
        },
        {
          type: 'inside',
          zoomOnMouseWheel: this._options.isAdminKeyboardNavigationMode ? 'shift' : true,
          moveOnMouseWheel: this._options.isAdminKeyboardNavigationMode ? 'alt' : false,
          start: gfxConfig.zoomLevel,
          end: 100
        }
      ],

      grid: {
        left: legendsLeftBlock,
        width: this._width - legendsLeftBlock - (this._isMobile ? 35 : 20),
        height: graphHeight
      },
      xAxis: {
        min: gfxConfig.min,
        max: gfxConfig.max,
        scale: true,
        axisLabel: {
          formatter(val) {
            const theDatetime = moment(val).tz(self._config.contract.timezone);
            return `${theDatetime.format('L')}\n${theDatetime.format('LT')}`;
          }
        }
      },
      yAxis: {
        splitArea: {
          show: true
        },
        data: gfxConfig.rooms
      },
      series: [
        {
          type: 'custom',
          renderItem,
          itemStyle: {
            normal: {
              opacity: 0.8
            }
          },

          encode: {
            x: [1, 2],
            y: 0
          },
          data: dataset
        }
      ]
    };

    if (isHeightSupplied) {
      this._option.grid.top = 0;
    }

    if (this._option && typeof this._option === 'object') {
      if (document.querySelector(element) == null || this._destroyRequest) {
        return;
      }

      this._chart.setOption(this._option, true);
      this._initEvents(callback);

      document.querySelector(element).classList.remove('loading');
    }
  }

  _sortRooms() {
    const mapping = {
      idLabel: {},
      labelId: {}
    };

    const sorted = (() => {
      const sortedRoomsArray = [[], [], [], ['outing_']];

      this._config.contract.rooms.forEach(room => {
        mapping.idLabel[room.id] = room.label;
        mapping.labelId[room.label] = room.id;

        room.sensors.forEach(sensor => {
          switch (sensor.category) {
            case 'motion':
              sortedRoomsArray[0].push(`presence_${room.label}`);
              break;
            case 'bed':
              sortedRoomsArray[1].push(`pressure_${room.label}`);
              break;
            case 'door':
              sortedRoomsArray[2].push(`door_opening_${room.label}`);
              break;
            default:
              break;
          }
        });
      });

      [0, 1, 2].forEach(i => {
        sortedRoomsArray[i].sort();
      });

      return sortedRoomsArray[0]
        .concat(sortedRoomsArray[1])
        .concat(sortedRoomsArray[2])
        .concat(sortedRoomsArray[3])
        .reverse();
    })();

    return {
      sorted,
      mapping
    };
  }

  _hydrate(objParam) {
    let obj = {};
    obj.name = objParam.roomName;

    obj.value = [];
    obj.value[0] = objParam.roomId;
    obj.value[1] = objParam.start;
    obj.value[2] = objParam.end;
    obj.value[3] = objParam.tooltip;
    obj.value[4] = objParam.rangeType;

    obj = this._setItemStyles(obj, objParam);

    return obj;
  }

  _setItemStyles(obj, objParam) {
    const colors = {
      strippedPattern: '',
      normal: '',
      hover: ''
    };

    switch (objParam.rangeType.toLowerCase()) {
      case 'presence':
        colors.strippedPattern = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAJElEQVQYV2Ocet77PwMUZBtuZWSECYA4IDaYgHFAChlBBLI2AOMwFA++0ygPAAAAAElFTkSuQmCC';
        colors.normal = '#8abd36';
        colors.hover = '#95cf4b';
        break;
      case 'door_opening':
        colors.strippedPattern = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAJElEQVQYV2N8k6z4nwEKRObeZ2SECYA4IDaYgHFAChlBBLI2AM0TE1JtPulOAAAAAElFTkSuQmCC';
        colors.normal = '#ec6321';
        colors.hover = '#ec6321';
        break;
      case 'outing':
        colors.strippedPattern = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAJElEQVQYV2PkW7fiPwMUfAqKYGSECYA4IDaYgHFAChlBBLI2AMRkEy5MD0jpAAAAAElFTkSuQmCC';
        colors.normal = '#0eaea8';
        colors.hover = '#0eaea8';
        break;
      case 'pressure':
        colors.strippedPattern = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAJElEQVQYV2PMnir5nwEKpmY/Z2SECYA4IDaYgHFAChlBBLI2AKsIEk3sqguDAAAAAElFTkSuQmCC';
        colors.normal = '#6b9519';
        colors.hover = '#6b9519';
        break;
      case 'mask':
        colors.strippedPattern = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAJElEQVQYV2Ps7+//zwAFhYWFjIwwARAHxAYTMA5IISOIQNYGAOGSFAmytT3kAAAAAElFTkSuQmCC';
        colors.normal = '#8f8f8f';
        colors.hover = '#8f8f8f';
        break;
      default:
        break;
    }

    if (objParam.isTick) {
      colors.normal = '#000000';
      colors.hover = '#000000';
    }

    obj.itemStyle = {
      color: colors.normal
    };

    obj.emphasis = {
      itemStyle: {
        color: colors.hover
      }
    };

    if (this._options.isAdminTrustedRangesMode && !objParam.trusted) {
      const strippedPatternImg = new Image();
      strippedPatternImg.src = colors.strippedPattern;

      obj.itemStyle = {
        normal: {
          color: {
            image: strippedPatternImg,
            repeat: 'repeat'
          }
        }
      };

      obj.emphasis = {
        itemStyle: {
          opacity: 0.5,
          color: {
            image: strippedPatternImg,
            repeat: 'repeat'
          }
        }
      };
    }

    return obj;
  }

  _tooltip(objParam) {
    return `<b>${objParam.roomName}</b>
            <br>
            <hr>
            ${objParam.start} - ${objParam.end}<br>
            ${this._translationService.translate('PRESENCES.DURATION', {
              duration: objParam.duration
            })}`;
  }

  _renameRoomsAndAddMask(presences, gfxConfig, lastUpdate) {
    presences.forEach((item, key) => {
      if (item.name) {
        presences[key].value[0] = gfxConfig.rooms.indexOf(`${item.value[4]}_${gfxConfig.roomsMapping.idLabel[item.value[0]]}`);
      } else {
        // OUTINGS
        presences[key].value[0] = 0;
      }
    });

    gfxConfig.rooms.forEach((room, index) => {
      if (room.includes('pressure_')) {
        gfxConfig.rooms[index] = this._translationService.translate('PRESENCES.BED', {
          room: room.replace('pressure_', '').toLowerCase()
        });
      } else if (room.includes('door_opening_')) {
        gfxConfig.rooms[index] = this._translationService.translate('PRESENCES.DOOR', {
          room: room.replace('door_opening_', '').toLowerCase()
        });
      } else {
        gfxConfig.rooms[index] = room.replace('presence_', '').replace('outing_', this._translationService.translate('PRESENCES.OUTINGS'));
      }

      gfxConfig.rooms[index] = StringUtils.truncate(gfxConfig.rooms[index], this._isMobile ? 13 : 24, false);

      if (lastUpdate <= gfxConfig.max) {
        presences.push(
          this._hydrate({
            roomName: 'MASK',
            roomId: index,
            start: lastUpdate,
            end: gfxConfig.max,
            tooltip: 'MASK',
            rangeType: 'MASK',
            isTick: false,
            trusted: true
          })
        );
      }
    });

    return presences;
  }

  _rangesToPresences(ranges, gfxConfig) {
    const presences = [];

    Object.keys(ranges.days).forEach(theDate => {
      ranges.days[theDate].activities.forEach((activity, index) => {
        if (index === 0) {
          const min = moment(ranges.days[theDate].start).valueOf();
          const max = moment(ranges.days[theDate].end).valueOf();

          if (min < gfxConfig.min) {
            gfxConfig.min = min;
          }
          if (max > gfxConfig.max) {
            gfxConfig.max = max;
          }
        }

        if (!['presence', 'pressure', 'door_opening', 'outing'].includes(activity.rangeType)) {
          return;
        }

        const tooltip = this._tooltip({
          roomName: activity.rangeType === 'outing' ? this._translationService.translate('PRESENCES.OUTINGS') : gfxConfig.roomsMapping.idLabel[activity.room],
          start: moment(activity.start)
            .tz(this._config.contract.timezone)
            .format('LTS'),
          end: moment(activity.end)
            .tz(this._config.contract.timezone)
            .format('LTS'),
          duration: StringUtils.formatDuration(activity.duration, true)
        });

        if (['door_opening'].includes(activity.rangeType)) {
          if (moment.duration(activity.duration).valueOf() < 60 * 1000) {
            ranges.days[theDate].activities[index].displayEnd = moment(activity.displayStart)
              .add(60, 'seconds')
              .utc()
              .format('YYYY-MM-DDTHH:mm:ss.SSSZ');
          }
        }

        presences.push(
          this._hydrate({
            roomName: gfxConfig.roomsMapping.idLabel[activity.room],
            roomId: activity.room,
            start: moment(activity.displayStart).valueOf(),
            end: moment(activity.displayEnd).valueOf(),
            tooltip,
            rangeType: activity.rangeType,
            isTick: false,
            trusted: activity.trusted
          })
        );
      });
    });

    return presences;
  }

  _ticksToPresences(ticks, gfxConfig) {
    const presences = [];

    ticks.forEach(tick => {
      if (!['presence', 'pressure', 'door_opening', 'outing'].includes(tick.type)) {
        return;
      }

      const tickCreationDateTimestamp = moment(tick.createdAt).valueOf();
      if (tickCreationDateTimestamp < gfxConfig.min) {
        gfxConfig.min = tickCreationDateTimestamp;
      }
      if (tickCreationDateTimestamp > gfxConfig.max) {
        gfxConfig.max = tickCreationDateTimestamp;
      }

      const createdAt = moment(tick.createdAt);

      const tooltip = `<b>Tick :</b><br>${moment(tick.createdAt)
        .tz(this._config.contract.timezone)
        .format('YYYY-MM-DD<br>HH:mm:ss')}`;

      presences.push(
        this._hydrate({
          roomName: gfxConfig.roomsMapping.idLabel[tick.room],
          roomId: tick.room,
          start: createdAt.valueOf(),
          end: createdAt.add(500, 'milliseconds').valueOf(),
          tooltip,
          rangeType: tick.type,
          isTick: true,
          trusted: true
        })
      );
    });

    return presences;
  }

  _zoomLevel(min, max) {
    return 100 - 100 / ((max - min) / 86400000);
  }

  _initEvents(callback) {
    this._chart.on('mousemove', params => {
      if (params.name === 'MASK') {
        this._chart.getZr().setCursorStyle('default');
      } else {
        this._chart.getZr().setCursorStyle('pointer');
      }
    });

    this._chart.on('finished', () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  }
}
