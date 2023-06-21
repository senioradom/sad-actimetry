import moment from 'moment-timezone';
import getRandomInteger from './mockUtils';

// eslint-disable-next-line no-unused-vars
function get24HoursActivities() {
  const activities = [];
  const startTime = moment('2023-01-01T00:00:00').tz('Europe/Paris');
  const endTime = startTime.clone().endOf('day');

  const interval = moment.duration(30, 'minutes');

  const currentTime = startTime.clone();
  while (currentTime <= endTime) {
    activities.push({
      start: currentTime.toISOString(),
      end: currentTime.toISOString(),
      value: getRandomInteger(100, 200)
    });

    currentTime.add(interval);
  }

  return activities;
}

// eslint-disable-next-line no-unused-vars
function getWeeklyActivities() {
  const activities = [];
  const startDate = moment('2023-01-01T00:00:00').tz('Europe/Paris');
  const endDate = startDate.clone().add(6, 'day');

  const currentDate = startDate.clone();
  while (currentDate <= endDate) {
    currentDate.add(1, 'day');

    activities.push({
      start: currentDate.toISOString(),
      end: currentDate
        .clone()
        .endOf('day')
        .toISOString(),
      value: getRandomInteger(100, 200)
    });
  }

  return activities;
}

// export default getWeeklyActivities();
export default get24HoursActivities();
