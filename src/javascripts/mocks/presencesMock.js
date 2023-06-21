import moment from 'moment-timezone';
import contractMock from './contractMock';

const gfxDate = () => {
  return moment('2023-01-01T00:00:00').tz('Europe/Paris');
};

const presencesMock = {
  lastUpdate: gfxDate()
    .hour(22)
    .toISOString(),
  days: {
    [gfxDate().format('YYYY-MM-DD')]: {
      start: gfxDate().toISOString(),
      end: gfxDate()
        .add(1, 'day')
        .toISOString(),
      activities: [
        {
          start: gfxDate()
            .subtract(1, 'day')
            .set({ hour: 22, minute: 0 }),
          end: gfxDate().set({ hour: 3, minute: 0 }),
          room: contractMock.roomsMapping.BEDROOM_1
        },
        {
          start: gfxDate().set({ hour: 3, minute: 0 }),
          end: gfxDate().set({ hour: 3, minute: 5 }),
          room: contractMock.roomsMapping.WC
        },
        {
          start: gfxDate().set({ hour: 3, minute: 5 }),
          end: gfxDate().set({ hour: 6, minute: 0 }),
          room: contractMock.roomsMapping.BEDROOM_1
        },
        {
          start: gfxDate().set({ hour: 6, minute: 0 }),
          end: gfxDate().set({ hour: 6, minute: 10 }),
          room: contractMock.roomsMapping.WC
        },
        {
          start: gfxDate().set({ hour: 6, minute: 10 }),
          end: gfxDate().set({ hour: 6, minute: 55 }),
          room: contractMock.roomsMapping.KITCHEN
        },
        {
          start: gfxDate().set({ hour: 6, minute: 55 }),
          end: gfxDate().set({ hour: 7, minute: 40 }),
          room: contractMock.roomsMapping.BATHROOM
        },
        {
          start: gfxDate().set({ hour: 7, minute: 40 }),
          end: gfxDate().set({ hour: 7, minute: 45 }),
          room: contractMock.roomsMapping.WC
        },
        {
          start: gfxDate().set({ hour: 7, minute: 45 }),
          end: gfxDate().set({ hour: 7, minute: 55 }),
          room: contractMock.roomsMapping.LOUNGE
        },
        {
          start: gfxDate().set({ hour: 7, minute: 55 }),
          end: gfxDate().set({ hour: 8, minute: 0 }),
          room: contractMock.roomsMapping.LOUNGE,
          rangeType: 'door_opening'
        },
        {
          start: gfxDate().set({ hour: 8, minute: 0 }),
          end: gfxDate().set({ hour: 10, minute: 45 }),
          room: null,
          rangeType: 'outing'
        },
        {
          start: gfxDate().set({ hour: 10, minute: 45 }),
          end: gfxDate().set({ hour: 10, minute: 50 }),
          room: contractMock.roomsMapping.LOUNGE,
          rangeType: 'door_opening'
        },
        {
          start: gfxDate().set({ hour: 10, minute: 50 }),
          end: gfxDate().set({ hour: 10, minute: 55 }),
          room: contractMock.roomsMapping.LOUNGE
        },
        {
          start: gfxDate().set({ hour: 10, minute: 55 }),
          end: gfxDate().set({ hour: 11, minute: 55 }),
          room: contractMock.roomsMapping.KITCHEN,
          trusted: false
        },
        {
          start: gfxDate().set({ hour: 11, minute: 55 }),
          end: gfxDate().set({ hour: 13, minute: 30 }),
          room: contractMock.roomsMapping.LOUNGE
        },
        {
          start: gfxDate().set({ hour: 13, minute: 30 }),
          end: gfxDate().set({ hour: 13, minute: 45 }),
          room: contractMock.roomsMapping.BEDROOM_2
        },
        {
          start: gfxDate().set({ hour: 13, minute: 45 }),
          end: gfxDate().set({ hour: 13, minute: 50 }),
          room: contractMock.roomsMapping.LOUNGE
        },
        {
          start: gfxDate().set({ hour: 13, minute: 50 }),
          end: gfxDate().set({ hour: 13, minute: 55 }),
          room: contractMock.roomsMapping.LOUNGE,
          rangeType: 'door_opening'
        },
        {
          start: gfxDate().set({ hour: 13, minute: 55 }),
          end: gfxDate().set({ hour: 18, minute: 45 }),
          room: null,
          rangeType: 'outing'
        },
        {
          start: gfxDate().set({ hour: 18, minute: 45 }),
          end: gfxDate().set({ hour: 18, minute: 50 }),
          room: contractMock.roomsMapping.LOUNGE,
          rangeType: 'door_opening'
        },
        {
          start: gfxDate().set({ hour: 18, minute: 50 }),
          end: gfxDate().set({ hour: 18, minute: 55 }),
          room: contractMock.roomsMapping.LOUNGE
        },
        {
          start: gfxDate().set({ hour: 18, minute: 55 }),
          end: gfxDate().set({ hour: 19, minute: 30 }),
          room: contractMock.roomsMapping.KITCHEN
        },
        {
          start: gfxDate().set({ hour: 19, minute: 30 }),
          end: gfxDate().set({ hour: 19, minute: 40 }),
          room: contractMock.roomsMapping.WC
        },
        {
          start: gfxDate().set({ hour: 19, minute: 40 }),
          end: gfxDate().set({ hour: 21, minute: 15 }),
          room: contractMock.roomsMapping.LOUNGE,
          trusted: false
        },
        {
          start: gfxDate().set({ hour: 21, minute: 15 }),
          end: gfxDate().set({ hour: 22, minute: 0 }),
          room: contractMock.roomsMapping.BEDROOM_1
        }
      ]
    }
  }
};

const { activities } = presencesMock.days[gfxDate().format('YYYY-MM-DD')];

activities.forEach(presence => {
  presence.start = presence.start.toISOString();
  presence.end = presence.end.toISOString();
  presence.duration = moment.duration(moment(presence.end).diff(moment(presence.start))).toISOString();
  presence.displayStart = presence.start;
  presence.displayEnd = presence.end;

  // eslint-disable-next-line no-prototype-builtins
  if (!presence.hasOwnProperty('rangeType')) {
    presence.rangeType = 'presence';
  }
  // eslint-disable-next-line no-prototype-builtins
  if (!presence.hasOwnProperty('trusted')) {
    presence.trusted = true;
  }

  if (presence.room === contractMock.roomsMapping.BEDROOM_1) {
    activities.push({
      start: presence.start,
      end: presence.end,
      displayStart: presence.displayStart,
      displayEnd: presence.displayEnd,
      duration: presence.duration,
      rangeType: 'pressure',
      room: presence.room,
      trusted: presence.trusted
    });
  }
});

export default presencesMock;
