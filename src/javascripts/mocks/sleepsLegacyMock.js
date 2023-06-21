import moment from 'moment-timezone';
import getRandomInteger from './mockUtils';

const generateSleepLegacy = currentDate => {
  const wakeNumber = getRandomInteger(1, 4);

  const sleepStart = currentDate
    .clone()
    .subtract(1, 'day')
    .set({ hour: getRandomInteger(22, 23), minute: 0 });

  const randomMinutes = Math.floor(Math.random() * 60);
  const duration = moment.duration(getRandomInteger(7, 9), 'hours').add(randomMinutes, 'minutes');
  const sleepEnd = sleepStart.clone().add(duration);

  const sleepsLegacy = {
    start: sleepStart.toISOString(),
    end: sleepEnd.toISOString(),
    duration: duration.toISOString(),
    wakeNumber,
    details: []
  };

  for (let i = 0; i < wakeNumber; i += 1) {
    sleepsLegacy.details.push({});
  }

  return sleepsLegacy;
};

const sleepsLegacyMock = {};

const startDate = moment('2023-01-01T00:00:00').tz('Europe/Paris');
const endDate = startDate.clone().add(6, 'day');

const currentDate = startDate.clone();
while (currentDate <= endDate) {
  currentDate.add(1, 'day');
  const currentDay = currentDate.format('YYYY-MM-DD');
  sleepsLegacyMock[currentDay] = generateSleepLegacy(currentDate);
}

export default sleepsLegacyMock;
