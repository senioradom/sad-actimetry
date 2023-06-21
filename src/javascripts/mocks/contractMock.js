const contractMock = {
  ref: 'BOX1_REF',
  language: 'fr',
  timezone: 'Europe/Paris',
  persons: [
    {
      firstname: 'John',
      lastname: 'Doe',
      roles: ['beneficiary']
    }
  ],
  rooms: [
    {
      id: 1,
      type: 'bedroom',
      label: 'Chambre 1',
      sensors: [
        {
          category: 'motion',
          type: 'motion'
        },
        {
          category: 'bed',
          type: 'pressure'
        }
      ]
    },
    {
      id: 2,
      type: 'bedroom',
      label: 'Chambre 2',
      sensors: [
        {
          category: 'motion',
          type: 'motion'
        }
      ]
    },
    {
      id: 3,
      type: 'bath',
      label: 'Salle de bain',
      sensors: [
        {
          category: 'motion',
          type: 'motion'
        }
      ]
    },
    {
      id: 4,
      type: 'kitchen',
      label: 'Cuisine',
      sensors: [
        {
          category: 'motion',
          type: 'motion'
        }
      ]
    },
    {
      id: 5,
      type: 'lounge',
      label: 'Séjour',
      sensors: [
        {
          category: 'motion',
          type: 'motion'
        },
        {
          category: 'door',
          type: 'door'
        }
      ]
    },
    {
      id: 6,
      type: 'wc',
      label: 'WC',
      sensors: [
        {
          category: 'motion',
          type: 'motion'
        }
      ]
    }
  ],
  roomsMapping: {
    BEDROOM_1: 1,
    BEDROOM_2: 2,
    BATHROOM: 3,
    KITCHEN: 4,
    LOUNGE: 5,
    WC: 6
  }
};

export default contractMock;
