import moment from 'moment';
import 'moment-timezone';

export default class Config {
  constructor(settings) {
    this.isReady = false;
    this.language = 'fr';

    this.api = 'https://gateway-v2.senioradom.com';

    this.init(settings);
  }

  async init(settings) {
    if (settings.username && settings.password) {
      this.credentials = `${btoa(`${settings.username}:${settings.password}`)}`;
    } else if (settings.basicAuth) {
      this.credentials = settings.basicAuth;
    }

    if (settings.api) {
      this.api = settings.api;
      if (this.api.endsWith('/')) {
        this.api = this.api.substring(0, this.api.length - 1);
      }
    }

    const response = await fetch(`${this.api}/api/3/contracts/${settings.contractRef}`, {
      headers: {
        authorization: `Basic ${this.credentials}`,
      },
      method: 'GET',
    });

    this.contract = await response.json();

    if (this.contract) {
      this.isReady = true;

      if (settings.language) {
        this.language = settings.language;
      } else if (this.contract.language) {
        this.language = this.contract.language;
      }

      moment.locale(this.language);

      document.dispatchEvent(new CustomEvent('actimetryIsReady'));
    } else {
      throw new Error('No contract...');
    }
  }
}
