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

// const chat = {
//   testsession: [
//     {
//       sender: 'bob',
//       text: 'hello everyone',
//       timestamp: time.getNextTime(),
//     },
//     {
//       sender: 'alice',
//       text: 'Hi Bob, how are you?',
//       timestamp: time.getNextTime(6000),
//     },
//     {
//       sender: 'bob',
//       text: 'good',
//       timestamp: time.getNextTime(4000),
//     },
//     {
//       sender: 'bob',
//       text: 'you?',
//       timestamp: time.getNextTime(2000),
//     },
//     {
//       sender: 'alice',
//       text: 'I\'m doing well.',
//       timestamp: time.getNextTime(5000),
//     },
//     {
//       sender: 'alice',
//       text: 'Are we ready to begin soon?\nI think we\'re all here.',
//       timestamp: time.getNextTime(3000),
//     },
//     {
//       sender: 'bob',
//       text: 'sounds good to me',
//       timestamp: time.getNextTime(6000),
//     },
//     {
//       sender: 'bob',
//       text: 'let me just find my medication',
//       timestamp: time.getNextTime(2000),
//     },
//     {
//       sender: 'bob',
//       text: 'its around here somewhere',
//       timestamp: time.getNextTime(4000),
//     },
//     {
//       sender: 'bob',
//       text: 'got it lets go',
//       timestamp: time.getNextTime(10000),
//     },
//   ],
// };
const chat = [];

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
