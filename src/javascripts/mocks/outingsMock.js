import moment from 'moment-timezone';
import getRandomInteger from './mockUtils';

const outingsMock = {};

function generateOutings(currentDate, hour) {
  const start = currentDate.clone().set({
    hour,
    minute: 5
  });
  const randomHours = Math.floor(Math.random() * 3);
  const randomMinutes = Math.floor(Math.random() * 60);
  const duration = moment.duration(randomHours, 'hours').add(randomMinutes, 'minutes');
  const end = start.clone().add(duration);
  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
}

const startDate = moment('2023-01-01T00:00:00').tz('Europe/Paris');
const endDate = startDate.clone().add(6, 'day');

const currentDate = startDate.clone();
while (currentDate <= endDate) {
  currentDate.add(1, 'day');
  const currentDay = currentDate.format('YYYY-MM-DD');
  outingsMock[currentDay] = [];

  const numberOfOutings = getRandomInteger(1, 4);

  for (let i = 1; i <= numberOfOutings; i += 1) {
    let hour = 0;
    // eslint-disable-next-line default-case
    switch (i) {
      case 1:
        hour = 10;
        break;
      case 2:
        hour = 13;
        break;
      case 3:
        hour = 16;
        break;
      case 4:
        hour = 20;
        break;
    }

    const outingStartEnd = generateOutings(currentDate, hour);
    outingsMock[currentDay].push({
      start: outingStartEnd.start,
      end: outingStartEnd.end
    });
  }
}

export default outingsMock;
