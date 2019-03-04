import Config from './model/Config';
import Presences from './model/Presences';
import Temperatures from './model/Temperatures';
import Outings from './model/Outings';
import Sleeps from './model/Sleeps';
import Activities from './model/Activities';

import '../stylesheets/styles.scss';

export default class Actimetry {
  constructor(settings) {
    this.config = new Config(settings);
    this.presences = new Presences(this.config);
    this.temperatures = new Temperatures(this.config);
    this.sleeps = new Sleeps(this.config);
    this.outings = new Outings(this.config);
    this.activities = new Activities(this.config);
  }
}
