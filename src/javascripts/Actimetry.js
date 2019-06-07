/* eslint-disable no-unused-vars */
import I18n from './model/I18n';
/* eslint-enable no-unused-vars */
import Config from './model/Config';
import Presences from './model/Presences';
import TemperaturesHeatmap from './model/TemperaturesHeatmap';
import Outings from './model/Outings';
import SleepsLegacy from './model/SleepsLegacy';
import Activities from './model/Activities';
import ActivitiesAndSleeps from './model/ActivitiesAndSleeps';
import DailyMovesPerRoom from './model/DailyMovesPerRoom';
import Sleeps from './model/Sleeps';

import '../stylesheets/styles.scss';

export default class Actimetry {
  constructor(settings) {
    this.config = new Config(settings);
    this.presences = new Presences(this.config);
    this.temperatures = new TemperaturesHeatmap(this.config);
    this.sleepsLegacy = new SleepsLegacy(this.config);
    this.outings = new Outings(this.config);
    this.activities = new Activities(this.config);
    this.activitiesAndSleeps = new ActivitiesAndSleeps(this.config);
    this.dailyMovesPerRoom = new DailyMovesPerRoom(this.config);
    this.sleeps = new Sleeps(this.config);
  }
}
