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
        movesPerDayAndRoom: [['2019-06-07', 21, 3907], ['2019-06-07', 122, 3908], ['2019-06-07', 130, 3909], ['2019-06-07', 226, 3910], ['2019-06-07', 153, 3911], ['2019-06-07', 78, 3913], ['2019-06-07', 110, 3914], ['2019-06-07', 192, 3915], ['2019-06-08', 66, 3907], ['2019-06-08', 32, 3908], ['2019-06-08', 18, 3909], ['2019-06-08', 12, 3910], ['2019-06-08', 25, 3911], ['2019-06-08', 102, 3913], ['2019-06-08', 91, 3914], ['2019-06-08', 194, 3915], ['2019-06-09', 100, 3907], ['2019-06-09', 34, 3908], ['2019-06-09', 262, 3909], ['2019-06-09', 215, 3910], ['2019-06-09', 277, 3911], ['2019-06-09', 276, 3913], ['2019-06-09', 183, 3914], ['2019-06-09', 93, 3915], ['2019-06-10', 288, 3907], ['2019-06-10', 75, 3908], ['2019-06-10', 146, 3909], ['2019-06-10', 88, 3910], ['2019-06-10', 68, 3911], ['2019-06-10', 48, 3913], ['2019-06-10', 24, 3914], ['2019-06-10', 263, 3915], ['2019-06-11', 26, 3907], ['2019-06-11', 155, 3908], ['2019-06-11', 149, 3909], ['2019-06-11', 299, 3910], ['2019-06-11', 250, 3911], ['2019-06-11', 226, 3913], ['2019-06-11', 58, 3914], ['2019-06-11', 198, 3915], ['2019-06-12', 221, 3907], ['2019-06-12', 275, 3908], ['2019-06-12', 277, 3909], ['2019-06-12', 126, 3910], ['2019-06-12', 110, 3911], ['2019-06-12', 55, 3913], ['2019-06-12', 237, 3914], ['2019-06-12', 29, 3915], ['2019-06-13', 84, 3907], ['2019-06-13', 170, 3908], ['2019-06-13', 76, 3909], ['2019-06-13', 266, 3910], ['2019-06-13', 291, 3911], ['2019-06-13', 219, 3913], ['2019-06-13', 111, 3914], ['2019-06-13', 26, 3915]],
      },
    };

    this.initDataset(movesPerRoom, element);
  }

  initDataset(dataset, element) {
    const self = this;

    const gfxConfig = {
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
          htmlTooltip += `<p style="font-weight:bold;color: #00827d;font-size:14px;">${params[0].data[0]} - ${totalMoves} mouvements au total</p>`;
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
