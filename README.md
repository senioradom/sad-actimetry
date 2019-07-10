# SeniorAdom Actimetry

## Initialisation

```
// Signature
const actimetry = new Actimetry(settings);

// Examples
// If the contract is linked to one contract
const actimetry = new Actimetry({
  username: 'email@domain.com',
  password: 'Pa$$w0rd'
});


// If the contract is linked to many contracts
const actimetry = new Actimetry({
  username: 'email@domain.com',
  password: 'Pa$$w0rd',
  contractRef: 'A0000XXX'
});
```

## Settings

```
const settings = {
  username: 'email@domain.com',
  password: 'Pa$$w0rd',
  basicAuth: 'ZW1haWxAZG9tYWluLmNvbTpQYSQkdzByZA==',
  contractRef: 'A0000XXX',
  api: {
    contract: 'https://contract.senioradom.com/api/1',
    actimetry: 'https://gateway.senioradom.com/3',
  }
}
```
**Required**  
`username`

At least one from  
`password`  
`basicAuth`

**Not required**  
`contractRef` : allows to select one contract when user is associated to many  
`api.contract` : override contract API environment variable  
`api.actimetry` : override actimetry API environment variable  
`language` : language, ['en', 'fr', 'es'], default : 'fr'

## Usage

### Presences

```
// Signature
actimetry.presences.draw(DOMElement, start, end);

// Usage
actimetry.presences.draw('#presences', threeDaysAgo, now);
```

### Temperatures week
#### week
```
// Signature
actimetry.temperatures.draw(DOMElement, type, start, end);

// Usage
actimetry.temperatures.draw('#temperatures-week', 'week', oneWeekAgo, now);
```

#### 24H
```
// Signature
actimetry.temperatures.draw(DOMElement, type, start, end);

// Usage
actimetry.temperatures.draw('#temperatures-24h', '24h', twenty24hoursAgo, now);
```

### Sleeps
```
// Signature
actimetry.sleep.draw(DOMElement, start, end);

// Usage
actimetry.sleep.draw('#sleep', oneWeekAgo, now);
```

### Visits
```
// Signature
actimetry.outings.draw(DOMElement, start, end);

// Usage
actimetry.outings.draw('#outings', oneWeekAgo, now);
```

### Activities
```
// Signature
actimetry.activities.draw(DOMElement, start, end);

// Usage
actimetry.activities.draw('#activities-24h', twenty24hoursAgo, now);
actimetry.activities.draw('#activities-week', oneWeekAgo, now);
```
    
### Variables used in above examples

```
const timezone = 'Europe/Paris';

const now = moment().tz(timezone).endOf('day').format('YYYY-MM-DD');

const oneWeekAgo = moment(now).tz(timezone).subtract(6, 'days').endOf('day').format('YYYY-MM-DD');

const twenty24hoursAgo = moment(now).tz(timezone).subtract(1, 'days').endOf('day').format('YYYY-MM-DD');

const threeDaysAgo = moment(now).tz(timezone).subtract(3, 'days').format('YYYY-MM-DD');
```

## Run for developement

```
npm run start
```


## Build for production
```
npm run build:dist

# Generated files
actimetry.js
actimetry.css
index.html
```

## Sources
### WebPack boilderplate
**Github**  
https://github.com/ericalli/static-site-boilerplate  
**Documentation**  
https://docs.staticsiteboilerplate.com/getting-started/commands

### ECharts (charting library)
**Github**  
https://github.com/apache/incubator-echarts  
**Documentation**  
http://echarts.apache.org/

## Dependencies
The project is dependant on the following libraries :  
- [ECharts](https://ecomfe.github.io/echarts-doc/public/en/index.html)
- [Moment.js](https://momentjs.com/)
- [Moment Timezone](https://momentjs.com/timezone/)
