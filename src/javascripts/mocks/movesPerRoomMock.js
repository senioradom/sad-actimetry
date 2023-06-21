import moment from 'moment-timezone';
import contractMock from './contractMock';
import getRandomInteger from './mockUtils';

const movesPerRoomMock = {
  moves: {}
};

const startDate = moment('2023-01-01T00:00:00').tz('Europe/Paris');
const endDate = startDate.clone().add(6, 'day');

const currentDate = startDate.clone();
while (currentDate <= endDate) {
  currentDate.add(1, 'day');
  const currentDay = currentDate.format('YYYY-MM-DD');
  movesPerRoomMock.moves[currentDay] = [];
  Object.keys(contractMock.roomsMapping).forEach(roomName => {
    let count = 0;
    switch (true) {
      case roomName === 'BEDROOM_1':
        count = getRandomInteger(100, 200);
        break;
      case roomName === 'BEDROOM_2':
        count = getRandomInteger(20, 30);
        break;
      case roomName === 'BATHROOM':
        count = getRandomInteger(50, 125);
        break;
      case roomName === 'KITCHEN':
        count = getRandomInteger(125, 333);
        break;
      case roomName === 'LOUNGE':
        count = getRandomInteger(75, 435);
        break;
      case roomName === 'WC':
        count = getRandomInteger(20, 40);
        break;
      default:
        break;
    }

    movesPerRoomMock.moves[currentDay].push({
      room: contractMock.roomsMapping[roomName],
      count
    });
  });
}

export default movesPerRoomMock;
