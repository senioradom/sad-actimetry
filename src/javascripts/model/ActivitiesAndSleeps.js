/* global echarts */
/* global moment */

export default class ActivitiesAndSleeps {
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
    // @todo : Plug to real data
    // const response = await fetch(`${this.config.api.actimetry}/contracts/${this.config.contract.ref}/actimetry/activities?end=${end}&start=${start}&timezone=${this.config.contract.timezone}`, {
    //   headers: {
    //     authorization: `Basic ${this.config.credentials}`,
    //   },
    //   method: 'GET',
    // });

    // const activitiesAndSleeps = await response.json();

    const activitiesAndSleeps = {
      data: {
        days: {
          '2019-06-06': {
            activities: [
              {
                room: 3907,
                duration: 'PT51M29S',
              },
              {
                room: 3908,
                duration: 'PT17M10S',
              },
              {
                room: 3909,
                duration: 'PT2H51M40S',
              },
              {
                room: 3910,
                duration: 'PT1H30M25S',
              },
              {
                room: 3911,
                duration: 'PT2H24M21S',
              },
              {
                room: 3913,
                duration: 'PT1H10M12S',
              },
              {
                room: 3914,
                duration: 'PT1H50M18S',
              },
              {
                room: 3915,
                duration: 'PT2H7M32S',
              },
            ],
            sleeps: {
              start: '2019-06-06T23:31:54+0200',
              end: '2019-06-07T05:17:55+0200',
              duration: 'PT5H46M1S',
              wakeNumber: 3,
            },
          },
          '2019-06-07': {
            activities: [
              {
                room: 3907,
                duration: 'PT47M35S',
              },
              {
                room: 3908,
                duration: 'PT15M58S',
              },
              {
                room: 3909,
                duration: 'PT1H8M48S',
              },
              {
                room: 3910,
                duration: 'PT2H5M',
              },
              {
                room: 3911,
                duration: 'PT2H12M52S',
              },
              {
                room: 3913,
                duration: 'PT2H11M56S',
              },
              {
                room: 3914,
                duration: 'PT31M34S',
              },
              {
                room: 3915,
                duration: 'PT2H43M20S',
              },
            ],
            sleeps: {
              start: '2019-06-07T23:58:25+0200',
              end: '2019-06-08T06:47:48+0200',
              duration: 'PT6H49M23S',
              wakeNumber: 1,
            },
          },
          '2019-06-08': {
            activities: [
              {
                room: 3907,
                duration: 'PT1H38M14S',
              },
              {
                room: 3908,
                duration: 'PT2H10M3S',
              },
              {
                room: 3909,
                duration: 'PT1H41M34S',
              },
              {
                room: 3910,
                duration: 'PT17M51S',
              },
              {
                room: 3911,
                duration: 'PT14M21S',
              },
              {
                room: 3913,
                duration: 'PT1H51M21S',
              },
              {
                room: 3914,
                duration: 'PT2H3M42S',
              },
              {
                room: 3915,
                duration: 'PT1H51M59S',
              },
            ],
            sleeps: {
              start: '2019-06-08T23:46:41+0200',
              end: '2019-06-09T07:01:07+0200',
              duration: 'PT7H14M26S',
              wakeNumber: 2,
            },
          },
          '2019-06-09': {
            activities: [
              {
                room: 3907,
                duration: 'PT1H43M9S',
              },
              {
                room: 3908,
                duration: 'PT1H1M40S',
              },
              {
                room: 3909,
                duration: 'PT1H24M31S',
              },
              {
                room: 3910,
                duration: 'PT37M16S',
              },
              {
                room: 3911,
                duration: 'PT1H57M56S',
              },
              {
                room: 3913,
                duration: 'PT1H44M35S',
              },
              {
                room: 3914,
                duration: 'PT2H6M46S',
              },
              {
                room: 3915,
                duration: 'PT36S',
              },
            ],
            sleeps: {
              start: '2019-06-09T20:24:42+0200',
              end: '2019-06-10T04:57:25+0200',
              duration: 'PT8H32M43S',
              wakeNumber: 3,
            },
          },
          '2019-06-10': {
            activities: [
              {
                room: 3907,
                duration: 'PT16M48S',
              },
              {
                room: 3908,
                duration: 'PT33M21S',
              },
              {
                room: 3909,
                duration: 'PT2H15M54S',
              },
              {
                room: 3910,
                duration: 'PT2H41M33S',
              },
              {
                room: 3911,
                duration: 'PT14M6S',
              },
              {
                room: 3913,
                duration: 'PT9M3S',
              },
              {
                room: 3914,
                duration: 'PT1H7M3S',
              },
              {
                room: 3915,
                duration: 'PT26M8S',
              },
            ],
            sleeps: {
              start: '2019-06-10T21:15:38+0200',
              end: '2019-06-11T02:47:43+0200',
              duration: 'PT5H32M5S',
              wakeNumber: 4,
            },
          },
          '2019-06-11': {
            activities: [
              {
                room: 3907,
                duration: 'PT4M19S',
              },
              {
                room: 3908,
                duration: 'PT2H27M10S',
              },
              {
                room: 3909,
                duration: 'PT58M13S',
              },
              {
                room: 3910,
                duration: 'PT1H12M30S',
              },
              {
                room: 3911,
                duration: 'PT28M6S',
              },
              {
                room: 3913,
                duration: 'PT2M38S',
              },
              {
                room: 3914,
                duration: 'PT2H49M52S',
              },
              {
                room: 3915,
                duration: 'PT2H40M52S',
              },
            ],
            sleeps: {
              start: '2019-06-11T23:57:13+0200',
              end: '2019-06-12T09:17:22+0200',
              duration: 'PT9H20M9S',
              wakeNumber: 4,
            },
          },
          '2019-06-12': {
            activities: [
              {
                room: 3907,
                duration: 'PT34M30S',
              },
              {
                room: 3908,
                duration: 'PT1H56M5S',
              },
              {
                room: 3909,
                duration: 'PT29M56S',
              },
              {
                room: 3910,
                duration: 'PT18M34S',
              },
              {
                room: 3911,
                duration: 'PT2H13M12S',
              },
              {
                room: 3913,
                duration: 'PT41M27S',
              },
              {
                room: 3914,
                duration: 'PT2H55M37S',
              },
              {
                room: 3915,
                duration: 'PT2H10M46S',
              },
            ],
            sleeps: {
              start: '2019-06-12T20:59:55+0200',
              end: '2019-06-13T02:01:21+0200',
              duration: 'PT5H1M26S',
              wakeNumber: 2,
            },
          },
        },
      },
    };

    this.initDataset(activitiesAndSleeps, element);
  }

  initDataset(activitiesAndSleeps, element) {
    const self = this;

    const roomIds = [];

    const gfxConfig = {
      rooms: [],
      xAxis: [],
      tooltips: {},
    };

    const rawDataset = {
      activities: [],
      sleeps: [],
    };

    Object.keys(activitiesAndSleeps.data.days)
      .forEach((theDate) => {
        gfxConfig.xAxis.push(theDate);

        if (Object.prototype.hasOwnProperty.call(activitiesAndSleeps.data.days, theDate)) {
          activitiesAndSleeps.data.days[theDate].activities.forEach((activity) => {
            if (roomIds.indexOf(activity.room) === -1) {
              roomIds.push(activity.room);
            }

            if (!Object.prototype.hasOwnProperty.call(rawDataset.activities, activity.room)) {
              rawDataset.activities[activity.room] = [];
            }

            rawDataset.activities[activity.room].push(moment.duration(activity.duration)
              .valueOf());
          });
        }

        rawDataset.sleeps.push(moment.duration(activitiesAndSleeps.data.days[theDate].sleeps.duration)
          .valueOf());

        gfxConfig.tooltips[theDate] = activitiesAndSleeps.data.days[theDate].sleeps;
      });

    roomIds.sort();

    const dataset = [];
    roomIds.forEach((roomId) => {
      const roomLabel = self.config.contract.rooms.filter(room => room.id === roomId)[0].label;
      gfxConfig.rooms.push(roomLabel);

      dataset.push({
        name: roomLabel,
        type: 'line',
        data: rawDataset.activities[roomId],
        smooth: true,
        lineStyle: {
          normal: {
            opacity: 0.5,
          },
        },
      });
    });

    dataset.push({
      name: 'Sommeil',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      itemStyle: {
        normal: {
          color: '#87c540',
        },
      },
      data: rawDataset.sleeps,
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
        bottom: 10,
        left: 'center',
        padding: 10,
        itemGap: 20,
        icon: 'bar',
        data: gfxConfig.rooms,
      },
      title: {
        text: 'Durée du sommeil quotidien',
        textStyle: {
          color: '#222',
          fontWeight: 'normal',
          fontSize: 24,
        },
        bottom: '21%',
        left: 'left',
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

          let htmlTooltip = `
<div class="activities-and-sleeps-tooltip">
<p class="header header--activities"><i class="icon-activities"></i> Activités</p>`;
          activites.forEach((item) => {
            htmlTooltip += `<p>${item.seriesName}: <strong>${moment.utc(item.data)
              .format('HH[h]mm')}</strong></p>`;
          });

          htmlTooltip += `
<p class="header header--sleeps"><i class="icon-sleeps"></i> Sommeil</p>
<p>Durée : <strong>${moment.utc(moment.duration(sleep.duration)
    .as('milliseconds'))
    .format('HH[h]mm')}</strong></p>
<p>Heure de coucher : <strong>${moment(sleep.start)
    .format('HH[h]mm')}</strong></p>
<p>Heure de réveil : <strong>${moment(sleep.end)
    .format('HH[h]mm')}</strong></p>
<p>Nombre de levers nocturne : <strong>${sleep.wakeNumber}</strong></p>
</div>          
`;
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
        width: '95%',
      },
      {
        left: '0%',
        right: '0%',
        top: '75%',
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
