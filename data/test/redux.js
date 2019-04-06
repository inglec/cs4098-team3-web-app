const auth = { uid: 'inglec', token: 'testtoken' };

const chat = {
  testsession: [],
};

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const time = new Date().getTime();

const sessions = {
  futuresession: {
    groupId: 'testgroup',
    startTime: time + HOUR * 3,
  },
  testsession: {
    groupId: 'testgroup',
    startTime: time - HOUR * 4,
  },
  pastsession1: {
    groupId: 'testgroup',
    startTime: time - DAY,
    endTime: time - HOUR * 23,
  },
  pastsession2: {
    groupId: 'testgroup',
    startTime: time - DAY * 2,
    endTime: time - DAY * 2 + HOUR,
  },
};

const users = {
  asmirnov: {
    avatarUrl: 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/21764727_1455812101175146_8839021650530126003_n.jpg?_nc_cat=111&_nc_ht=scontent-dub4-1.xx&oh=8bb0b3a27e3978d1348e2ed77c9a13ee&oe=5D394DD5',
    bio: '',
    email: 'asmirnov@tcd.ie',
    name: 'Alex Smirnov',
    phone: '',
    userType: 'patient',
  },
  conevin: {
    avatarUrl: 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/43623109_2122898621094707_4230587724802818048_n.jpg?_nc_cat=108&_nc_ht=scontent-dub4-1.xx&oh=0dc292c8cf6b8d2fba80ce1e03ec0181&oe=5D4B979F',
    bio: '',
    email: 'conevin@tcd.ie',
    name: 'Conor Nevin',
    phone: '',
    userType: 'patient',
  },
  cosgroco: {
    avatarUrl: 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/15823569_1537247706303376_3674684857587182972_n.jpg?_nc_cat=103&_nc_ht=scontent-dub4-1.xx&oh=f70e0efc18034aa9bda9688b925bad02&oe=5D4FB1DE',
    bio: '',
    email: 'cosgroco@tcd.ie',
    name: 'Conal Cosgrove',
    phone: '',
    userType: 'patient',
  },
  ebergman: {
    avatarUrl: 'https://scontent-dub4-1.xx.fbcdn.net/v/t1.0-9/38131538_1978746728843073_3547039487756337152_n.jpg?_nc_cat=103&_nc_ht=scontent-dub4-1.xx&oh=585c775760cdecdaefec7671315a8fe1&oe=5D4551DA',
    bio: '',
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
    bio: '',
    email: 'meaneych@tcd.ie',
    name: 'Chris Meaney',
    phone: '',
    userType: 'patient',
  },
};


export default {
  auth,
  chat,
  sessions,
  users,
};
