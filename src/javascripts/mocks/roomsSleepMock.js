import moment from 'moment-timezone';
import contractMock from './contractMock';
import getRandomInteger from './mockUtils';

const roomsSleepMock = {};

const timePerRoomPerDayInMinutes = {
  BEDROOM_1: [6 * 60, 9 * 60],
  BEDROOM_2: [5, 60],
  BATHROOM: [20, 50],
  KITCHEN: [45, 90],
  LOUNGE: [60, 3 * 60],
  WC: [25, 40]
};

const startDate = moment('2023-01-01T00:00:00').tz('Europe/Paris');
const endDate = startDate.clone().add(6, 'day');

const currentDate = startDate.clone();
while (currentDate <= endDate) {
  currentDate.add(1, 'day');
  const currentDay = currentDate.format('YYYY-MM-DD');
  roomsSleepMock[currentDay] = { rooms: [] };
  Object.keys(timePerRoomPerDayInMinutes).forEach(roomName => {
    roomsSleepMock[currentDay].rooms.push({
      room: contractMock.roomsMapping[roomName],
      duration: moment.duration(getRandomInteger(timePerRoomPerDayInMinutes[roomName][0], timePerRoomPerDayInMinutes[roomName][1]), 'minutes').toISOString()
    });
  });
}

export default roomsSleepMock;
