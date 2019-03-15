const uuidv4 = require('uuid/v4');

// Could be replaced with a generator, but requires configuration
class Time {
  constructor() {
    this.time = new Date().getTime();
  }

  getNextTime(elapsed = 0) {
    this.time += elapsed;
    return this.time;
  }
}

const time = new Time();
const auth = { uid: uuidv4().substring(0, 8), token: 'testtoken' };

const chat = {
  testsession: [
    {
      uid: 'bob',
      timestamp: time.getNextTime(),
      message: 'hello everyone',
    },
    {
      uid: 'alice',
      timestamp: time.getNextTime(6000),
      message: 'Hi Bob, how are you?',
    },
    {
      uid: 'bob',
      timestamp: time.getNextTime(4000),
      message: 'good',
    },
    {
      uid: 'bob',
      timestamp: time.getNextTime(2000),
      message: 'you?',
    },
    {
      uid: 'alice',
      timestamp: time.getNextTime(5000),
      message: 'I\'m doing well.',
    },
    {
      uid: 'alice',
      timestamp: time.getNextTime(3000),
      message: 'Are we ready to begin soon?\nI think we\'re all here.',
    },
    {
      uid: 'bob',
      timestamp: time.getNextTime(6000),
      message: 'sounds good to me',
    },
    {
      uid: 'bob',
      timestamp: time.getNextTime(2000),
      message: 'let me just find my medication',
    },
    {
      uid: 'bob',
      timestamp: time.getNextTime(4000),
      message: 'its around here somewhere',
    },
    {
      uid: 'bob',
      timestamp: time.getNextTime(10000),
      message: 'got it lets go',
    },
  ],
};

const sessions = [
  {
    day: 'Thursday',
    active: false,
    complete: true,
  },
  {
    day: 'Friday',
    active: true,
    complete: false,
  },
  {
    day: 'Saturday',
    active: false,
    complete: false,
  },
  {
    day: 'Sunday',
    active: false,
    complete: false,
  },
  {
    day: 'Monday',
    active: false,
    complete: false,
  },
];


export default {
  auth,
  chat,
  sessions,
};
