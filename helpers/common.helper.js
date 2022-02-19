import UsersHelper from '../helpers/users.helper';

class CommonHelper {
  constructor() {
    this.localDB = {
      users: [],
      transactions: [],
    };
  }
  getRandomItem = (a) => a[Math.floor(Math.random() * a.length)];

  async createAndAddUser(n) {
    const usersHelper = new UsersHelper();
    if (!n || n <= 0) {
      n = 1;
    }
    for (let i = 0; i < n; i++) {
      await usersHelper.createNew();
      let user = usersHelper.response.body;
      this.localDB.users.push(user);
    }
    return this.localDB;
  }

  generateRandom = (n) => Math.floor(Math.random() * n);

  wipeLocalDB = () => {
    this.localDB = {
      users: [],
      transactions: [],
    };
  };

  generateValidTransactionBetweenTwoUsers = (array) => {
    //1 choose 2 defferent users
    this.user1 = array[this.generateRandom(array.length)];
    this.user2 = array[this.generateRandom(array.length)];
    while (this.user1.id === this.user2.id) {
      this.user2 = array[this.generateRandom(array.length)];
    }
    this.value = this.generateRandom(this.user1.amount);
    return [this.user1.id, this.user2.id, this.value];
  };
}

export default CommonHelper;
