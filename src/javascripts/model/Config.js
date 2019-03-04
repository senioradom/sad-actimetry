/* global sad */

export default class Config {
  constructor(settings) {
    this.isReady = false;

    this.api = {
      actimetry: null,
      contract: null,
    };

    this.init(settings);
  }

  async init(settings) {
    if (settings.username && settings.password) {
      this.credentials = `${btoa(`${settings.username}:${settings.password}`)}`;
    } else if (settings.basicAuth) {
      this.credentials = settings.basicAuth;
    }

    if (settings.api && settings.api.contract) {
      this.api.contract = settings.api.contract;
    } else {
      this.api.contract = sad.api.contract;
    }

    if (settings.api && settings.api.actimetry) {
      this.api.actimetry = settings.api.actimetry;
    } else {
      this.api.actimetry = sad.api.actimetry;
    }

    const response = await fetch(`${this.api.contract}/users/${settings.username}/contracts`, {
      headers: {
        authorization: `Basic ${this.credentials}`,
      },
      method: 'GET',
    });

    const contract = await response.json();

    if (settings.contractRef) {
      [this.contract] = contract.data.filter(c => c.ref === settings.contractRef);
    } else {
      [this.contract] = [contract.data[0]];
    }

    if (this.contract) {
      this.isReady = true;
      document.dispatchEvent(new CustomEvent('actimetryIsReady'));
    } else {
      throw new Error('No contract...');
    }
  }
}
