import echarts from 'echarts/dist/echarts.min';
import moment from 'moment';
import 'moment-timezone';
import I18n from './I18n';

export default class DashboardTile1 {
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

    const response = await fetch(`${this.config.api}/api/4/contracts/${this.config.contract.ref}/actimetry/rooms-sleep?end=${end}&start=${start}&timezone=${this.config.contract.timezone}`, {
      headers: {
        authorization: `Basic ${this.config.credentials}`,
      },
      method: 'GET',
    });

    const activitiesPerRoom = await response.json();

    this.initDataset(activitiesPerRoom, element);
  }

  initDataset(activitiesPerRoom, element) {
    const hasActivities = Object.values(activitiesPerRoom).reduce((total, currentObj) => total + currentObj.rooms.length, 0) > 0;

    if (hasActivities) {
      const self = this;

      const roomIds = [];

      const gfxConfig = {
        rooms: [],
        xAxis: [],
        tooltips: {},
      };

      const rawDataset = [];

      Object.keys(activitiesPerRoom)
        .forEach((theDate) => {
          gfxConfig.xAxis.push(theDate);

          if (Object.prototype.hasOwnProperty.call(activitiesPerRoom, theDate)) {
            activitiesPerRoom[theDate].rooms.forEach((presence) => {
              if (roomIds.indexOf(presence.room) === -1) {
                roomIds.push(presence.room);
              }

              if (!Object.prototype.hasOwnProperty.call(rawDataset, presence.room)) {
                rawDataset[presence.room] = [];
              }

              rawDataset[presence.room]
                .push(
                  moment.duration(presence.duration)
                    .valueOf(),
                );
            });
          }
        });

      roomIds.sort();

      const dataset = [];
      roomIds.forEach((roomId) => {
        const roomLabel = self.config.contract.rooms.filter(room => room.id === roomId)[0].label;
        gfxConfig.rooms.push(roomLabel);

        dataset.push({
          name: roomLabel,
          type: 'line',
          data: rawDataset[roomId],
          smooth: true,
          showSymbol: false,
          lineStyle: {
            normal: {
              opacity: 0.5,
            },
          },
        });
      });

      this.setOptions(dataset, gfxConfig, element);
    } else {
      document.querySelector(element)
        .classList
        .remove('loading');

      document.querySelector(element).innerHTML = `<div class="actimetry__no-data">${I18n.strings[this.config.language].no_data}</div>`;
    }
  }

  setOptions(dataset, gfxConfig, element) {
    const myChart = echarts.init(document.querySelector(element));

    const self = this;
    self.tooltips = gfxConfig.tooltips;

    this.option = {
      backgroundColor: '#fff',
      animation: false,
      legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 5,
        itemGap: 5,
        icon: 'bar',
        data: gfxConfig.rooms,
      },
      axisPointer: {
        link: {
          xAxisIndex: 'all',
        },
        label: {
          backgroundColor: '#777',
        },
      },
      grid: {
        top: '2%',
        y: 0,
        y2: 75,
      },
      xAxis: [{
        type: 'category',

        data: gfxConfig.xAxis,
        boundaryGap: false,
        axisLine: {
          onZero: false,
        },
        splitLine: {
          show: false,
        },
        min: 'dataMin',
        max: 'dataMax',
      },
      ],
      yAxis: [{
        scale: true,
        axisLabel: {
          formatter(value) {
            let roundedMinutes = Math.floor(moment.utc(moment.duration(value)
              .as('milliseconds'))
              .minute() / 30) * 30;

            if (!roundedMinutes) {
              roundedMinutes = '00';
            }

            return moment.utc(moment.duration(value)
              .as('milliseconds'))
              .format(`HH[h${roundedMinutes}]`);
          },
        },
        splitArea: {
          show: true,
        },
      },
      ],
      series: dataset,
    };

    if (this.option && typeof this.option === 'object') {
      myChart.setOption(this.option, true);

      document.querySelector(element)
        .classList
        .remove('loading');
    }
  }
}
