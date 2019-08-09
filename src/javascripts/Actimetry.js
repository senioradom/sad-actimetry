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

import '../stylesheets/styles.scss';
import Fixtures from './model/Fixtures';

export default class Actimetry {
  constructor(settings) {
    this.config = new Config(settings);
    this.presences = new Presences(this.config);
    this.temperatures = new TemperaturesHeatmap(this.config);
    this.temperaturesLegacy = new TemperaturesLegacy(this.config);
    this.sleepsLegacy = new SleepsLegacy(this.config);
    this.outings = new Outings(this.config);
    this.activities = new Activities(this.config);
    this.presencesAndSleep = new PresencesAndSleep(this.config);
    this.movesPerRoom = new MovesPerRoom(this.config);
    this.sleeps = new Sleeps(this.config);
    this.fixtures = new Fixtures(this.config);
  }
}
