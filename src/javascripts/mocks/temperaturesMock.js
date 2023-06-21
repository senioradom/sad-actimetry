import moment from 'moment-timezone';
import getRandomInteger from './mockUtils';

const temperaturesMock = {};

const startDate = moment('2023-01-01T00:00:00').tz('Europe/Paris');
const endDate = startDate.clone().add(6, 'day');

const currentDate = startDate.clone();
while (currentDate <= endDate) {
  currentDate.add(1, 'day');
  const currentDay = currentDate.format('YYYY-MM-DD');
  temperaturesMock[currentDay] = [];

  const startTime = currentDate.clone().startOf('day');
  const endTime = currentDate.clone().endOf('day');

  const interval = moment.duration(30, 'minutes');

  const currentTime = startTime.clone();
  while (currentTime <= endTime) {
    let temperature = 0;
    switch (true) {
      case currentTime.isBetween(currentTime.clone().set({ hour: 0, minute: 0 }), currentTime.clone().set({ hour: 7, minute: 59 })):
        temperature = getRandomInteger(18, 20);
        break;
      case currentTime.isBetween(currentTime.clone().set({ hour: 8, minute: 0 }), currentTime.clone().set({ hour: 11, minute: 59 })):
        temperature = getRandomInteger(20, 23);
        break;
      case currentTime.isBetween(currentTime.clone().set({ hour: 12, minute: 0 }), currentTime.clone().set({ hour: 15, minute: 59 })):
        temperature = getRandomInteger(23, 28);
        break;
      case currentTime.isBetween(currentTime.clone().set({ hour: 16, minute: 0 }), currentTime.clone().set({ hour: 19, minute: 59 })):
        temperature = getRandomInteger(20, 23);
        break;
      case currentTime.isBetween(currentTime.clone().set({ hour: 20, minute: 0 }), currentTime.clone().set({ hour: 23, minute: 59 })):
        temperature = getRandomInteger(18, 20);
        break;
      default:
        break;
    }

    temperaturesMock[currentDay].push({
      createdAt: currentTime.toISOString(),
      temp: temperature
    });
    currentTime.add(interval);
  }
}

export default temperaturesMock;
