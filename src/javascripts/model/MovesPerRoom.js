import echarts from 'echarts/dist/echarts.min';
import moment from 'moment';
import 'moment-timezone';
import I18n from './I18n';

export default class MovesPerRoom {
  constructor(config) {
    this._config = config;
    this._destroyRequest = false;
  }

  draw(element, start, end) {
    if (this._destroyRequest) {
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
    if (this._destroyRequest) {
      return;
    }

    document.querySelector(element).classList.add('loading');

    const response = await fetch(
      `${this._config.api}/api/4/contracts/${this._config.contract.ref}/actimetry/moves?end=${end}&start=${start}&timezone=${this._config.contract.timezone}`,
      {
        headers: {
          authorization: `Basic ${this._config.credentials}`
        },
        method: 'GET'
      }
    );

    const movesPerRoom = await response.json();

    this._checkForData(movesPerRoom, element);
  }

  _checkForData(movesPerRoom, element) {
    if (this._destroyRequest) {
      return;
    }

    const hasActivities =
      Object.values(movesPerRoom.moves).reduce(
        (total, currentObj) => total + currentObj.length,
        0
      ) > 0;
    if (hasActivities) {
      this._initDataset(movesPerRoom, element);
    } else {
      document.querySelector(element).classList.remove('loading');

      document.querySelector(
        element
      ).innerHTML = `<div class="actimetry__no-data">${
        I18n.strings[this._config.language].no_data
      }</div>`;
    }
  }

  _initDataset(movesPerRoom, element) {
    if (this._destroyRequest) {
      return;
    }

    const self = this;

    const gfxConfig = {
      colors: [
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
      rooms: []
    };

    const mappingRoomsIdsToLabels = Object.assign(
      ...Object.entries(self._config.contract.rooms).map(([, v]) => ({
        [v.id]: v.label
      }))
    );

    this._numberOfMovesThisMonth = movesPerRoom.monthAverage;

    const dataset = [];

    Object.keys(movesPerRoom.moves).forEach(theDate => {
      movesPerRoom.moves[theDate].forEach(tickCount => {
        const label = mappingRoomsIdsToLabels[tickCount.room];

        if (!gfxConfig.rooms.includes(label)) {
          gfxConfig.rooms.push(label);
        }

        dataset.push([moment(theDate).format(), tickCount.count, label]);
      });
    });

    this._setOptions(dataset, gfxConfig, element);
  }

  _setOptions(dataset, gfxConfig, element) {
    if (this._destroyRequest) {
      return;
    }

    const myChart = echarts.init(document.querySelector(element));

    const self = this;

    this._option = {
      color: gfxConfig.colors,
      grid: {
        left: '0%'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: true
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        extraCssText:
          'box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2); padding:21px;',
        position(pos) {
          return {
            top: 10,
            left: pos[0]
          };
        },
        formatter(params) {
          const beneficiary = self._config.contract.persons.filter(
            p => p.roles.indexOf('beneficiary') > -1
          );

          let totalMoves = 0;
          params.forEach(item => {
            totalMoves += item.data[1];
          });

          let htmlTooltip = '<div style="color:black;">';
          htmlTooltip += `<p style="font-weight:bold;color: #00827d;font-size:14px;">${moment(
            params[0].data[0]
          ).format('DD/MM/YYYY')} - ${totalMoves} ${
            I18n.strings[self._config.language].total_moves
          }</p>`;
          htmlTooltip += `<p>${
            I18n.strings[self._config.language].this_month
          } ${
            beneficiary.length
              ? `${beneficiary[0].firstname} ${beneficiary[0].lastname}`
              : ''
          } ${I18n.strings[self._config.language].was_detected} <strong>${
            self._numberOfMovesThisMonth
          }</strong> ${I18n.strings[self._config.language].times_2}.</p>`;

          params.forEach(item => {
            const rez = `<p>${item.data[2]}: <strong>${item.data[1]} ${
              I18n.strings[self._config.language].moves
            }</strong></p>`;
            htmlTooltip += rez;
          });

          htmlTooltip += '</div>';

          return htmlTooltip;
        }
      },

      legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 5,
        itemGap: 5,
        icon: 'bar',
        data: gfxConfig.rooms
      },

      singleAxis: {
        top: 50,
        bottom: 100,
        x: 'center',
        axisLabel: {
          formatter(theDate) {
            return moment(theDate).format('DD/MM');
          }
        },
        type: 'time',
        splitNumber: 0,
        axisPointer: {
          animation: true,
          label: {
            show: true
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            opacity: 0.2
          }
        }
      },

      series: [
        {
          type: 'themeRiver',
          label: {
            formatter(v) {
              return `{customStyle|${v.value[2]}}`;
            },
            show: false,
            position: 'right',
            align: 'right',
            rich: {
              customStyle: {
                color: '#222',
                width: 200
              }
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.8)'
            }
          },
          data: dataset
        }
      ]
    };

    if (this._option && typeof this._option === 'object') {
      if (this._destroyRequest) {
        return;
      }

      myChart.setOption(this._option, true);

      document.querySelector(element).classList.remove('loading');
    }
  }
}
