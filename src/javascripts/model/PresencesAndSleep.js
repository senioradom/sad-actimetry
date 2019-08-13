import echarts from 'echarts/dist/echarts.min';
import moment from 'moment';
import 'moment-timezone';
import I18n from './I18n';

export default class PresencesAndSleep {
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

    const roomsAndSleeps = await response.json();

    this.initDataset(roomsAndSleeps, element);
  }

  initDataset(roomsAndSleeps, element) {
    const self = this;

    const roomIds = [];

    const gfxConfig = {
      rooms: [],
      xAxis: [],
      tooltips: {},
    };

    const rawDataset = {
      rooms: [],
      sleep: [],
    };

    Object.keys(roomsAndSleeps)
      .forEach((theDate) => {
        gfxConfig.xAxis.push(theDate);

        if (Object.prototype.hasOwnProperty.call(roomsAndSleeps, theDate)) {
          roomsAndSleeps[theDate].rooms.forEach((presence) => {
            if (roomIds.indexOf(presence.room) === -1) {
              roomIds.push(presence.room);
            }

            if (!Object.prototype.hasOwnProperty.call(rawDataset.rooms, presence.room)) {
              rawDataset.rooms[presence.room] = [];
            }

            rawDataset.rooms[presence.room]
              .push(
                moment.duration(presence.duration)
                  .valueOf(),
              );
          });
        }

        if (roomsAndSleeps[theDate].sleep) {
          rawDataset.sleep
            .push(
              moment.duration(roomsAndSleeps[theDate].sleep.duration)
                .valueOf(),
            );

          gfxConfig.tooltips[theDate] = roomsAndSleeps[theDate].sleep;
        } else {
          rawDataset.sleep
            .push(
              0,
            );

          gfxConfig.tooltips[theDate] = null;
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
        data: rawDataset.rooms[roomId],
        smooth: true,
        lineStyle: {
          normal: {
            opacity: 0.5,
          },
        },
      });
    });

    dataset.push({
      name: I18n.strings[this.config.language].sleep,
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      itemStyle: {
        normal: {
          color: '#87c540',
        },
      },
      data: rawDataset.sleep,
    });

    this.setOptions(dataset, gfxConfig, element);
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
        bottom: 0,
        left: 'center',
        padding: [0, 0, 0, 0],
        itemGap: 20,
        icon: 'bar',
        data: gfxConfig.rooms,
      },
      title: {
        text: I18n.strings[self.config.language].daily_sleep_duration,
        textStyle: {
          color: '#222',
          fontWeight: 'normal',
          fontSize: 24,
        },
        bottom: '21%',
        left: '4%',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: true,
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        extraCssText: 'box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2); padding:21px;',
        position(pos) {
          return {
            top: 10,
            left: pos[0],
          };
        },
        formatter(params) {
          const activites = params.filter(serie => serie.seriesType === 'line');
          let sleep = params.filter(serie => serie.seriesType === 'bar');

          sleep = self.tooltips[sleep[0].axisValue];

          let htmlTooltip = `<div class="presences-and-sleep-tooltip">
          <p class="header header--activities">
          <i class="icon-activities"></i> ${I18n.strings[self.config.language].presences}
          </p>`;
          activites.forEach((item) => {
            htmlTooltip += `<p>${item.seriesName}: <strong>${moment.utc(item.data)
              .format('HH[h]mm')}</strong></p>`;
          });


          if (sleep) {
            htmlTooltip += `
            <p class="header header--sleeps">
            <i class="icon-sleeps"></i> ${I18n.strings[self.config.language].sleep}
            </p>
            <p>${I18n.strings[self.config.language].duration} : <strong>${moment.utc(moment.duration(sleep.duration)
  .as('milliseconds'))
  .format('HH[h]mm')}</strong></p>
            <p>${I18n.strings[self.config.language].bedtime} : <strong>${moment(sleep.start)
  .format('HH[h]mm')}</strong></p>
            <p>${I18n.strings[self.config.language].wakeup_time} : <strong>${moment(sleep.end)
  .format('HH[h]mm')}</strong></p>
            <p>${I18n.strings[self.config.language].number_of_wakeups_during_the_night} : <strong>${sleep.wakeNumber}</strong></p>
            </div>`;
          }

          return htmlTooltip;
        },
      },
      axisPointer: {
        link: {
          xAxisIndex: 'all',
        },
        label: {
          backgroundColor: '#777',
        },
      },
      grid: [{
        left: '5%',
        right: '0%',
        height: '60%',
        width: '90%',
      },
      {
        left: '5%',
        right: '0%',
        top: '80%',
        width: '90%',
        height: '15%',
      },
      ],
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
      {
        type: 'category',
        gridIndex: 1,
        data: gfxConfig.xAxis,
        axisLine: {
          onZero: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
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
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
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
