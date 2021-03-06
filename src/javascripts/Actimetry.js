// IE 11 Polyfills not provided by core-js
import 'url-polyfill';
import 'isomorphic-fetch';
import 'custom-event-polyfill';

import { version } from '../../package.json';

import TranslationService from './services/TranslationService';
import Config from './config/Config';

import Presences from './graphs/Presences';
import TemperaturesHeatmap from './graphs/TemperaturesHeatmap';
import TemperaturesLegacy from './graphs/TemperaturesLegacy';
import Outings from './graphs/Outings';
import SleepsLegacy from './graphs/SleepsLegacy';
import Activities from './graphs/Activities';
import PresencesAndSleep from './graphs/PresencesAndSleep';
import MovesPerRoom from './graphs/MovesPerRoom';
import Sleeps from './graphs/Sleeps';
import DashboardTile1 from './graphs/DashboardTile1';
import Fixtures from './graphs/Fixtures';

import '../stylesheets/styles.scss';

export default class Actimetry {
  constructor(settings) {
    this._translationService = new TranslationService();
    this._config = new Config(settings, this._translationService);

    this.presences = new Presences(this._config, this._translationService);
    this.temperatures = new TemperaturesHeatmap(this._config, this._translationService);
    this.temperaturesLegacy = new TemperaturesLegacy(this._config, this._translationService);
    this.sleepsLegacy = new SleepsLegacy(this._config, this._translationService);
    this.outings = new Outings(this._config, this._translationService);
    this.activities = new Activities(this._config, this._translationService);
    this.presencesAndSleep = new PresencesAndSleep(this._config, this._translationService);
    this.movesPerRoom = new MovesPerRoom(this._config, this._translationService);
    this.sleeps = new Sleeps(this._config, this._translationService);
    this.fixtures = new Fixtures(this._config, this._translationService);
    this.dashboardTile1 = new DashboardTile1(this._config, this._translationService);

    this.version = version;
  }

  setLanguage(newLanguage) {
    if (this._translationService.language !== newLanguage) {
      this._translationService.setLanguage(newLanguage);
    }
  }
}
