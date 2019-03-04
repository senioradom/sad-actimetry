/* global echarts */
/* global moment */

export default class Presences {
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
    const response = await fetch(`${this.config.api.actimetry}/contracts/${this.config.contract.ref}/actimetry/ranges?end=${end}&start=${start}&timezone=${this.config.contract.timezone}`, {
      headers: {
        authorization: `Basic ${this.config.credentials}`,
      },
      method: 'GET',
    });

    const ranges = await response.json();
    this.initDataset(ranges, element);
  }

  initDataset(ranges, element) {
    const gfxConfig = {
      min: Number.MAX_SAFE_INTEGER,
      max: Number.MIN_SAFE_INTEGER,
    };

    const rooms = this.sortRooms();
    gfxConfig.rooms = rooms.sorted;
    gfxConfig.roomsMapping = rooms.mapping;

    let dataset = this.rangesToPresences(ranges, gfxConfig);
    dataset = this.renameRoomsAndAddMask(dataset, gfxConfig, moment(ranges.data.lastUpdate)
      .valueOf());
    gfxConfig.zoomLevel = this.zoomLevel(gfxConfig.min, gfxConfig.max);

    this.setOptions(dataset, gfxConfig, element);
  }

  setOptions(dataset, gfxConfig, element) {
    const self = this;
    this.chart = echarts.init(document.querySelector(element));

    function renderItem(params, api) {
      const heightRatio = api.value(3) === 'MASK' ? 1 : 0.6;

      const categoryIndex = api.value(0);
      const start = api.coord([api.value(1), categoryIndex]);
      const end = api.coord([api.value(2), categoryIndex]);
      const height = api.size([0, 1])[1] * heightRatio;

      const rectShape = echarts.graphic.clipRectByRect({
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height,
      }, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      });

      return rectShape && {
        type: 'rect',
        shape: rectShape,
        style: api.style(),
        styleEmphasis: api.styleEmphasis(),
      };
    }

    this.option = {
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        formatter(params) {
          return params.value[3] === 'MASK' ? undefined : params.value[3];
        },
      },
      dataZoom: [
        {
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          top: 400,
          height: 10,
          borderColor: 'transparent',
          backgroundColor: '#e2e2e2',
          handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
          handleSize: 20,
          handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa',
          },
          labelFormatter: '',
          start: gfxConfig.zoomLevel,
          end: 100,
        },
        {
          type: 'inside',
          start: gfxConfig.zoomLevel,
          end: 100,
        },
      ],

      grid: {
        left: '15%',
        height: 300,
      },
      xAxis: {
        min: gfxConfig.min,
        max: gfxConfig.max,
        scale: true,
        axisLabel: {
          formatter(val) {
            const theDatetime = moment(val)
              .tz(self.config.contract.timezone);
            return `${theDatetime.format('DD/MM')}\n${theDatetime.format('HH:mm')}`;
          },
        },
      },
      yAxis: {
        splitArea: {
          show: true,
        },
        data: gfxConfig.rooms,
      },
      series: [
        {
          type: 'custom',
          renderItem,
          itemStyle: {
            normal: {
              opacity: 0.8,
            },
          },

          encode: {
            x: [1, 2],
            y: 0,
          },
          data: dataset,
        },
      ],
    };

    if (this.option && typeof this.option === 'object') {
      this.chart.setOption(this.option, true);
      this.initEvents();
    }
  }

  sortRooms() {
    const mapping = {
      idLabel: {},
      labelId: {},
    };

    const sorted = ((() => {
      const sortedRoomsArray = [[], [], [], ['OUTING_']];

      this.config.contract.kit.sensors.forEach((sensor) => {
        mapping.idLabel[sensor.room.id] = sensor.room.label;
        mapping.labelId[sensor.room.label] = sensor.room.id;

        switch (sensor.type) {
          case 'PASSIVE_INFRARED_SENSOR':
          case 'SIGFOX_PASSIVE_INFRARED_SENSOR':
            sortedRoomsArray[0].push(`PRESENCE_${sensor.room.label}`);
            break;
          case 'PRESENCE_BED_SENSOR':
            sortedRoomsArray[1].push(`PRESSURE_${sensor.room.label}`);
            break;
          case 'DOOR_MAGNET_SENSOR':
          case 'SIGFOX_DOOR_MAGNET_SENSOR':
            sortedRoomsArray[2].push(`DOOR_OPENING_${sensor.room.label}`);
            break;
          default:
            break;
        }
      });

      [0, 1, 2].forEach((i) => {
        sortedRoomsArray[i].sort();
      });

      return (sortedRoomsArray[0].concat(sortedRoomsArray[1])
        .concat(sortedRoomsArray[2])
        .concat(sortedRoomsArray[3])).reverse();
    })());

    return {
      sorted,
      mapping,
    };
  }

  hydrate(objParam) {
    const colors = this.colorRange(objParam.rangeType);

    const obj = {};
    obj.name = objParam.roomName;

    obj.value = [];
    obj.value[0] = objParam.roomId;
    obj.value[1] = objParam.start;
    obj.value[2] = objParam.end;
    obj.value[3] = objParam.tooltip;
    obj.value[4] = objParam.rangeType;

    obj.itemStyle = {
      color: colors.normal,
    };

    obj.emphasis = {
      itemStyle: {
        color: colors.hover,
      },
    };

    return obj;
  }

  colorRange(rangeType) {
    const colors = {
      normal: '',
      hover: '',
    };

    switch (rangeType) {
      case 'PRESENCE':
        colors.normal = '#8abd36';
        colors.hover = '#95cf4b';
        break;
      case 'DOOR_OPENING':
        colors.normal = '#ec6321';
        colors.hover = '#ec6321';
        break;
      case 'OUTING':
        colors.normal = '#0eaea8';
        colors.hover = '#0eaea8';
        break;
      case 'PRESSURE':
        colors.normal = '#6b9519';
        colors.hover = '#6b9519';
        break;
      case 'MASK':
        colors.normal = '#8f8f8f';
        colors.hover = '#8f8f8f';
        break;
      default:
        break;
    }

    return colors;
  }

  tooltip(objParam) {
    return `<b>${objParam.roomName}</b><br>
                                <hr>
                                ${objParam.start} - ${objParam.end}<br>
                                <b>Durée :</b> ${objParam.duration}`;
  }

  renameRoomsAndAddMask(presences, gfxConfig, lastUpdate) {
    presences.forEach((item, key) => {
      if (item.name) {
        presences[key].value[0] = gfxConfig.rooms.indexOf(`${item.value[4]}_${gfxConfig.roomsMapping.idLabel[item.value[0]]}`);
      } else { // OUTINGS
        presences[key].value[0] = 0;
      }
    });

    gfxConfig.rooms.forEach((room, index) => {
      if (room.includes('PRESSURE_')) {
        gfxConfig.rooms[index] = `Lit (${room.replace('PRESSURE_', '')
          .toLowerCase()})`;
      } else if (room.includes('DOOR_OPENING_')) {
        gfxConfig.rooms[index] = `Porte (${room.replace('DOOR_OPENING_', '')
          .toLowerCase()})`;
      } else {
        gfxConfig.rooms[index] = room
          .replace('PRESENCE_', '')
          .replace('OUTING_', 'Sorties');
      }

      presences.push(
        this.hydrate({
          roomName: 'MASK',
          roomId: index,
          start: lastUpdate,
          end: gfxConfig.max,
          tooltip: 'MASK',
          rangeType: 'MASK',
        }),
      );
    });

    return presences;
  }

  rangesToPresences(ranges, gfxConfig) {
    const presences = [];

    Object.keys(ranges.data.days)
      .forEach((theDate) => {
        ranges.data.days[theDate].activities.forEach((activity, index) => {
          if (index === 0) {
            const min = moment(ranges.data.days[theDate].start)
              .valueOf();
            const max = moment(ranges.data.days[theDate].end)
              .valueOf();

            if (min < gfxConfig.min) {
              gfxConfig.min = min;
            }
            if (max > gfxConfig.max) {
              gfxConfig.max = max;
            }
          }

          if (!['PRESENCE', 'PRESSURE', 'DOOR_OPENING', 'OUTING'].includes(activity.rangeType)) {
            return;
          }

          const tooltip = this.tooltip({
            roomName: (activity.rangeType === 'OUTING') ? 'Sorties' : gfxConfig.roomsMapping.idLabel[activity.room],
            start: moment(activity.start)
              .format('HH:mm:ss'),
            end: moment(activity.end)
              .format('HH:mm:ss'),
            duration: moment.utc(moment.duration(activity.duration)
              .as('milliseconds'))
              .format('HH:mm:ss'),
          });

          presences.push(
            this.hydrate({
              roomName: gfxConfig.roomsMapping.idLabel[activity.room],
              roomId: activity.room,
              start: moment(activity.displayStart)
                .valueOf(),
              end: moment(activity.displayEnd)
                .valueOf(),
              tooltip,
              rangeType: activity.rangeType,
            }),
          );
        });
      });

    return presences;
  }

  zoomLevel(min, max) {
    return 100 - (100 / ((max - min) / 86400000));
  }

  initEvents() {
    this.chart.on('mousemove', (params) => {
      if (params.data.name === 'MASK') {
        this.chart.getZr()
          .setCursorStyle('default');
      } else {
        this.chart.getZr()
          .setCursorStyle('pointer');
      }
    });
  }
}
