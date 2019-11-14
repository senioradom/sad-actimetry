// IE 11 Polyfills not provided by core-js
import 'url-polyfill';
import 'isomorphic-fetch';
import 'custom-event-polyfill';
import { version } from '../../package.json';

/* eslint-disable no-unused-vars */
import I18n from './model/I18n';
/* eslint-enable no-unused-vars */
import Config from './model/Config';

import Presences from './model/Presences';
import TemperaturesHeatmap from './model/TemperaturesHeatmap';
import TemperaturesLegacy from './model/TemperaturesLegacy';
import Outings from './model/Outings';
import SleepsLegacy from './model/SleepsLegacy';
import Activities from './model/Activities';
import PresencesAndSleep from './model/PresencesAndSleep';
import MovesPerRoom from './model/MovesPerRoom';
import Sleeps from './model/Sleeps';
import DashboardTile1 from './model/DashboardTile1';
import Fixtures from './model/Fixtures';

import '../stylesheets/styles.scss';

export default class Actimetry {
  constructor(settings) {
    this._config = new Config(settings);

    this.presences = new Presences(this._config);
    this.temperatures = new TemperaturesHeatmap(this._config);
    this.temperaturesLegacy = new TemperaturesLegacy(this._config);
    this.sleepsLegacy = new SleepsLegacy(this._config);
    this.outings = new Outings(this._config);
    this.activities = new Activities(this._config);
    this.presencesAndSleep = new PresencesAndSleep(this._config);
    this.movesPerRoom = new MovesPerRoom(this._config);
    this.sleeps = new Sleeps(this._config);
    this.fixtures = new Fixtures(this._config);
    this.dashboardTile1 = new DashboardTile1(this._config);

    this.version = version;
  }

  setLanguage(newLanguage) {
    this._config.setLanguage(newLanguage);
  }
}
