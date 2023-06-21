import moment from 'moment-timezone';
import presencesMock from './presencesMock';

const ticksMock = [];

presencesMock.days[
  moment('2023-01-01T00:00:00')
    .tz('Europe/Paris')
    .format('YYYY-MM-DD')
].activities.forEach(presence => {
  ticksMock.push({
    type: presence.rangeType,
    createdAt: presence.start,
    room: presence.room
  });
});

export default ticksMock;
