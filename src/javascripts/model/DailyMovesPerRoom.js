/* global echarts */
/* global moment */

export default class DailyMovesPerRoom {
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

    // const movesPerRoom = await response.json();

    const movesPerRoom = {
      data: {
        averageMovesOnCurrentMonth: 999999,
        movesPerDayAndRoom: [['2019-06-07T00:00:00+0200', 163, 3907], ['2019-06-07T00:00:00+0200', 99, 3908], ['2019-06-07T00:00:00+0200', 53, 3909], ['2019-06-07T00:00:00+0200', 178, 3910], ['2019-06-07T00:00:00+0200', 202, 3911], ['2019-06-07T00:00:00+0200', 58, 3913], ['2019-06-07T00:00:00+0200', 126, 3914], ['2019-06-07T00:00:00+0200', 12, 3915], ['2019-06-08T00:00:00+0200', 184, 3907], ['2019-06-08T00:00:00+0200', 262, 3908], ['2019-06-08T00:00:00+0200', 171, 3909], ['2019-06-08T00:00:00+0200', 39, 3910], ['2019-06-08T00:00:00+0200', 183, 3911], ['2019-06-08T00:00:00+0200', 280, 3913], ['2019-06-08T00:00:00+0200', 25, 3914], ['2019-06-08T00:00:00+0200', 201, 3915], ['2019-06-09T00:00:00+0200', 178, 3907], ['2019-06-09T00:00:00+0200', 98, 3908], ['2019-06-09T00:00:00+0200', 256, 3909], ['2019-06-09T00:00:00+0200', 275, 3910], ['2019-06-09T00:00:00+0200', 284, 3911], ['2019-06-09T00:00:00+0200', 151, 3913], ['2019-06-09T00:00:00+0200', 235, 3914], ['2019-06-09T00:00:00+0200', 136, 3915], ['2019-06-10T00:00:00+0200', 111, 3907], ['2019-06-10T00:00:00+0200', 127, 3908], ['2019-06-10T00:00:00+0200', 76, 3909], ['2019-06-10T00:00:00+0200', 91, 3910], ['2019-06-10T00:00:00+0200', 77, 3911], ['2019-06-10T00:00:00+0200', 251, 3913], ['2019-06-10T00:00:00+0200', 214, 3914], ['2019-06-10T00:00:00+0200', 275, 3915], ['2019-06-11T00:00:00+0200', 188, 3907], ['2019-06-11T00:00:00+0200', 278, 3908], ['2019-06-11T00:00:00+0200', 40, 3909], ['2019-06-11T00:00:00+0200', 10, 3910], ['2019-06-11T00:00:00+0200', 215, 3911], ['2019-06-11T00:00:00+0200', 97, 3913], ['2019-06-11T00:00:00+0200', 156, 3914], ['2019-06-11T00:00:00+0200', 73, 3915], ['2019-06-12T00:00:00+0200', 55, 3907], ['2019-06-12T00:00:00+0200', 11, 3908], ['2019-06-12T00:00:00+0200', 293, 3909], ['2019-06-12T00:00:00+0200', 247, 3910], ['2019-06-12T00:00:00+0200', 64, 3911], ['2019-06-12T00:00:00+0200', 75, 3913], ['2019-06-12T00:00:00+0200', 287, 3914], ['2019-06-12T00:00:00+0200', 104, 3915], ['2019-06-13T00:00:00+0200', 142, 3907], ['2019-06-13T00:00:00+0200', 80, 3908], ['2019-06-13T00:00:00+0200', 185, 3909], ['2019-06-13T00:00:00+0200', 10, 3910], ['2019-06-13T00:00:00+0200', 105, 3911], ['2019-06-13T00:00:00+0200', 97, 3913], ['2019-06-13T00:00:00+0200', 82, 3914], ['2019-06-13T00:00:00+0200', 160, 3915]],
      },
    };

    this.initDataset(movesPerRoom, element);
  }

  initDataset(dataset, element) {
    const self = this;

    const gfxConfig = {
      colors: ['#b5aa9a', '#54c49f', '#7186d4', '#a782c8', '#ffb449', '#ffe343', '#a4e469', '#e49b6c', '#e46e91', '#6ccfe3'],
      rooms: [],
    };

    const mappingRoomsIdsToLabels = Object.assign(...Object.entries(self.config.contract.kit.rooms)
      .map(([, v]) => ({ [v.id]: v.label })));

    dataset.data.movesPerDayAndRoom.forEach((movePerRoom) => {
      if (!gfxConfig.rooms.includes(mappingRoomsIdsToLabels[movePerRoom[2]])) {
        gfxConfig.rooms.push(mappingRoomsIdsToLabels[movePerRoom[2]]);
      }
      movePerRoom[2] = mappingRoomsIdsToLabels[movePerRoom[2]];
    });

    this.setOptions(dataset, gfxConfig, element);
  }

  setOptions(dataset, gfxConfig, element) {
    const myChart = echarts.init(document.querySelector(element));

    const self = this;
    self.numberOfMovesThisMonth = dataset.data.averageMovesOnCurrentMonth;

    this.option = {
      color: gfxConfig.colors,
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
          let totalMoves = 0;
          params.forEach((item) => {
            totalMoves += item.data[1];
          });

          let htmlTooltip = '<div style="color:black;">';
          htmlTooltip += `<p style="font-weight:bold;color: #00827d;font-size:14px;">${moment(params[0].data[0]).format('DD/MM/YYYY')} - ${totalMoves} mouvements au total</p>`;
          htmlTooltip += `<p><strong>${self.numberOfMovesThisMonth} mouvements</strong> en moyenne ce mois-ci</p>`;
          params.forEach((item) => {
            const rez = `<p>${item.data[2]}: <strong>${item.data[1]} mouvements</strong></p>`;
            htmlTooltip += rez;
          });

          htmlTooltip += '</div>';

          return htmlTooltip;
        },
      },

      legend: {
        orient: 'horizontal',
        bottom: 0,
        left: 'center',
        padding: 10,
        itemGap: 20,
        icon: 'bar',
        data: gfxConfig.rooms,
      },

      singleAxis: {
        top: 50,
        bottom: 100,
        left: 100,
        axisLabel: {
          formatter(theDate) {
            return moment(theDate)
              .format('DD/MM');
          },
        },
        type: 'time',
        splitNumber: 0,
        axisPointer: {
          animation: true,
          label: {
            show: true,
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            opacity: 0.2,
          },
        },
      },

      series: [
        {
          type: 'themeRiver',
          label: {
            formatter(v) {
              return `{customStyle|${v.value[2]}}`;
            },
            position: 'right',
            align: 'right',
            rich: {
              customStyle: {
                color: '#222',
                width: 200,
              },
            },
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.8)',
            },
          },
          data: dataset.data.movesPerDayAndRoom,
        },
      ],
    };

    if (this.option && typeof this.option === 'object') {
      myChart.setOption(this.option, true);
      document.querySelector(element)
        .classList
        .remove('loading');
    }
  }
}
