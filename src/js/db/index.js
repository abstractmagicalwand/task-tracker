const db = [{
  project: 'ARCHIV',
  note: '',
  tasks: [{
    description: 'Me very old task. Mb completed?',
    id: 2,
    complete: false,
    project: 'ARCHIV',
    priority: 0,
    timeDeath: null,
    note: '',
    stopwatch: null,
    price: 300,
    timePrice: 60
  }],
}, {
  project: 'SANS',
  note: '',
  tasks: [{
    description: 'Drink milk.',
    id: 232,
    complete: false,
    project: '',
    priority: 0,
    timeDeath: null,
    note: '',
    stopwatch: [0, 0, 0],
    date: new Date(),
    price: 300,
    timePrice: 60
  }],
}, {
  project: '@shop',
  note: '',
  tasks: [{
    description: 'Buy milk.',
    id: 1,
    note: '',
    complete: false,
    project: '@shop',
    priority: 2,
    timeDeath: null,
    stopwatch: [0, 0, 0],
    date: new Date(2012, 10, 10),
    price: 300,
    timePrice: 60
  }],
}, {
  project: '@social',
  note: '',
  tasks: [{
    description: 'Will meet with girl.',
    id: 3,
    note: '',
    complete: false,
    project: '@social',
    priority: 3,
    timeDeath: [0, 0, 10],
    stopwatch: [0, 0, 0],
    date: new Date(2012, 10, 10),
    price: 300,
    timePrice: 60
  }],
}, {
  project: '@sport',
  note: '',
  tasks: [{
    description: 'Scamper.',
    id: 1322,
    complete: false,
    project: '@sport',
    priority: 4,
    timeDeath: null,
    note: '',
    stopwatch: [0, 0, 0],
    date: new Date(2013, 3, 1),
    price: 300,
    timePrice: 60
  }],
}];

export default db;