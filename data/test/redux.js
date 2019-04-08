import { parse } from 'query-string';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const time = new Date().getTime();

// Get "uid" from search params
const { uid } = parse(window.location.search);

const auth = {
  uid: uid || 'inglec',
  token: 'testtoken',
};

const chat = {
  pastsession1: [
    {
      sender: 'inglec',
      text: 'hello everyone',
      timestamp: time - DAY + MINUTE,
    },
    {
      sender: 'ebergman',
      text: 'Hi Ciarán, how are you?',
      timestamp: time - DAY + MINUTE + SECOND * 10,
    },
    {
      sender: 'inglec',
      text: 'good',
      timestamp: time - DAY + MINUTE + SECOND * 20,
    },
    {
      sender: 'inglec',
      text: 'you?',
      timestamp: time - DAY + MINUTE + SECOND * 25,
    },
    {
      sender: 'ebergman',
      text: 'I\'m doing well.',
      timestamp: time - DAY + MINUTE + SECOND * 30,
    },
    {
      sender: 'ebergman',
      text: 'Are we ready to begin soon?\nI think we\'re all here.',
      timestamp: time - DAY + MINUTE + SECOND * 40,
    },
    {
      sender: 'inglec',
      text: 'sounds good to me',
      timestamp: time - DAY + MINUTE + SECOND * 55,
    },
    {
      sender: 'inglec',
      text: 'let me just find my medication',
      timestamp: time - DAY + MINUTE * 2,
    },
    {
      sender: 'inglec',
      text: 'its around here somewhere',
      timestamp: time - DAY + MINUTE * 2 + SECOND * 10,
    },
    {
      sender: 'inglec',
      text: 'got it lets go',
      timestamp: time - DAY + MINUTE * 2 + SECOND * 30,
    },
  ],
};

const groups = {
  testgroup: {
    groupName: 'Test Group',
    admin: 'ebergman',
    users: ['asmirnov', 'conevin', 'cosgroco', 'ebergman', 'inglec', 'meaneych'],
    mentors: [],
  },
};

const sessions = {
  futuresession1: {
    groupId: 'testgroup',
    startTime: time + HOUR * 3,
  },
  futuresession2: {
    groupId: 'testgroup',
    startTime: time + HOUR * 5,
  },
  futuresession3: {
    groupId: 'testgroup',
    startTime: time + HOUR * 12,
  },
  testsession: {
    groupId: 'testgroup',
    startTime: time - HOUR * 4,
  },
  pastsession1: {
    groupId: 'testgroup',
    startTime: time - DAY,
    endTime: time - HOUR * 23,
    attendance: {
      ebergman: {
        joinedAt: time - DAY + MINUTE * 2,
        leftAt: time - DAY + MINUTE * 20,
      },
      inglec: {
        joinedAt: time - DAY + MINUTE,
        leftAt: time - DAY + MINUTE * 23,
        tickedAt: time - DAY + MINUTE * 4,
      },
    },
    review: {
      reviewedBy: 'ebergman',
      confirmed: ['ebergman', 'inglec'],
    },
    archiveUrl: 'http://techslides.com/demos/sample-videos/small.mp4',
  },
  pastsession2: {
    groupId: 'testgroup',
    startTime: time - DAY * 2,
    endTime: time - DAY * 2 + HOUR,
    attendance: {
      asmirnov: {
        joinedAt: time - DAY * 2 + MINUTE * 10,
        leftAt: time - DAY * 2 + MINUTE * 27,
      },
      conevin: {
        joinedAt: time - DAY * 2 + MINUTE * 5,
        leftAt: time - DAY * 2 + MINUTE * 22,
        tickedAt: time - DAY * 2 + MINUTE * 10,
      },
      ebergman: {
        joinedAt: time - DAY * 2 + MINUTE * 7,
        leftAt: time - DAY * 2 + MINUTE * 37,
        tickedAt: time - DAY * 2 + MINUTE * 13,
      },
    },
    review: {
      reviewedBy: 'ebergman',
      confirmed: ['asmirnov', 'conevin'],
    },
    archiveUrl: 'http://techslides.com/demos/sample-videos/small.mp4',
  },
  pastsession3: {
    groupId: 'testgroup',
    startTime: time - DAY * 3,
    endTime: time - DAY * 3 + HOUR,
    attendance: {
      cosgroco: {
        joinedAt: time - DAY * 3 + MINUTE * 5,
        leftAt: time - DAY * 3 + MINUTE * 22,
        tickedAt: time - DAY * 3 + MINUTE * 10,
      },
      inglec: {
        joinedAt: time - DAY * 3 + MINUTE * 7,
        leftAt: time - DAY * 3 + MINUTE * 37,
        tickedAt: time - DAY * 3 + MINUTE * 13,
      },
    },
    archiveUrl: 'http://techslides.com/demos/sample-videos/small.mp4',
  },
};

const users = {
  alice: {
    avatarUrl: 'https://cdn0.online.nursing.georgetown.edu/content/b232c0d9ddf244f180df39a4be44e773/nurse01.jpg',
    email: 'abrown@msf.ie',
    name: 'Alice Brown',
    userType: 'admin',
  },
  asmirnov: {
    avatarUrl: 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/21764727_1455812101175146_8839021650530126003_n.jpg?_nc_cat=111&_nc_ht=scontent-dub4-1.xx&oh=8bb0b3a27e3978d1348e2ed77c9a13ee&oe=5D394DD5',
    email: 'asmirnov@tcd.ie',
    name: 'Alex Smirnov',
    userType: 'patient',
  },
  conevin: {
    avatarUrl: 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/43623109_2122898621094707_4230587724802818048_n.jpg?_nc_cat=108&_nc_ht=scontent-dub4-1.xx&oh=0dc292c8cf6b8d2fba80ce1e03ec0181&oe=5D4B979F',
    email: 'conevin@tcd.ie',
    name: 'Conor Nevin',
    userType: 'patient',
  },
  cosgroco: {
    avatarUrl: 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/15823569_1537247706303376_3674684857587182972_n.jpg?_nc_cat=103&_nc_ht=scontent-dub4-1.xx&oh=f70e0efc18034aa9bda9688b925bad02&oe=5D4FB1DE',
    email: 'cosgroco@tcd.ie',
    name: 'Conal Cosgrove',
    userType: 'patient',
  },
  ebergman: {
    avatarUrl: 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/38131538_1978746728843073_3547039487756337152_n.jpg?_nc_cat=103&_nc_ht=scontent-dub4-1.xx&oh=585c775760cdecdaefec7671315a8fe1&oe=5D4551DA',
    email: 'ebergman@tcd.ie',
    name: 'Eddie Bergman',
    phone: '98724908',
    userType: 'patient',
  },
  inglec: {
    avatarUrl: 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/26731100_1933746966654896_5126254539882838997_n.jpg?_nc_cat=111&_nc_ht=scontent-dub4-1.xx&oh=06bb813dfe2755c2163d8b0fbeb5d93d&oe=5D4FF515',
    bio: 'I love coding',
    email: 'inglec@tcd.ie',
    name: 'Ciarán Ingle',
    phone: '98023409',
    userType: 'patient',
  },
  meaneych: {
    avatarUrl: 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/31505539_1681863828529799_1845192128741769216_n.jpg?_nc_cat=106&_nc_ht=scontent-dub4-1.xx&oh=9223746afca4229cdc5a90b9273d6d6e&oe=5D3A2B8D',
    email: 'meaneych@tcd.ie',
    name: 'Chris Meaney',
    userType: 'patient',
  },
};

export default {
  auth,
  chat,
  groups,
  sessions,
  users,
};
