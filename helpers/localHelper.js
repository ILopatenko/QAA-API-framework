import UsersHelper from './users.helper';
import { v4 as uuidv4 } from 'uuid';
const usersHelper = new UsersHelper();
class LocalHeper {
  constructor() {
    this.localTestUser = null;
    this.localDB = {
      users: [],
      transactions: [],
    };
    this.testData = {
      auth: {
        invalidCredentials: {
          login: 'trulala',
          password: 'tralala',
        },
        invalidTypeCredentials: {
          login: true,
          password: undefined,
        },
        spacesOnly: {
          login: '   ',
          password: '       ',
        },
        tokenLength: {
          valid: 36,
          invalid: 26,
        },
        responses: {
          success: 200,

          error: {
            wrongCred: {
              statusCode: 404,
              message: 'Wrong login or password.',
            },
            noCred: {
              statusCode: 400,
              message: 'No credentials provided.',
            },
          },
        },
      },
      users: {
        responses: {
          success: 200,
          successDelete: {
            statusCode: 200,
            message: 'User deleted.',
          },
          error: {
            noUserFound: {
              statusCode: 400,
              message: 'No user found.',
            },
          },
        },
        invalidCredentials: {
          unrealUser: {
            id: uuidv4(),
            amount: this.getRandomUpTo(10000),
          },
          wrongIDtype: {
            id: true,
            amount: this.getRandomUpTo(10000),
          },
        },
      },
      config: {
        amount: 1000,
        validConfig: {
          number_of_entries: this.getRandomBetweenInclusively(5, 25),
          initial_amount: this.getRandomUpTo(10000),
        },
        invalidConfigBigger: {
          number_of_entries: this.getRandomBetweenInclusively(26, 100),
          initial_amount: this.getRandomUpTo(10000),
        },
        invalidConfigLess: {
          number_of_entries: this.getRandomBetweenInclusively(0, 4),
          initial_amount: this.getRandomUpTo(10000),
        },
        responses: {
          success: 200,
          entityAreTooBig: {
            statusCode: 400,
            message:
              'Number of entries must be between 5 and 25 (inclusively).',
          },
        },
      },
      transaction: {
        responses: {
          succsess: {
            statusCode: 200,
          },
          error: {
            wrongFromID: {
              id: uuidv4(),
              statusCode: 400,
              message: 'Sender not found.',
            },
            wrongToID: {
              id: uuidv4(),
              statusCode: 400,
              message: 'Receiver not found.',
            },
            wrongTypeAmount: {
              amount: true,
              statusCode: 400,
              message: 'Invalid amount to send.',
            },
            randomTransactionID: {
              statusCode: 400,
              message: 'No transaction found.',
              id: uuidv4(),
            },
          },
        },
      },
    };
  }
  getRandomUpTo(maxValue) {
    return Math.floor(Math.random() * maxValue);
  }

  getRandomBetweenInclusively(minValue, maxValue) {
    let value =
      Math.floor(Math.random() * (maxValue - minValue)) + minValue + 1;
    while (value < minValue || value > maxValue) {
      value = Math.floor(Math.random() * (maxValue - minValue)) + minValue + 1;
    }
    return value;
  }
  addUserToLocalDB(user) {
    this.localDB.users.push(user);
  }

  deleteUserFromLocalDB(user) {
    this.localDB.users = this.localDB.users.filter((u) => u.id !== user.id);
  }

  getRandomUserFromLocalDB() {
    let id = this.getRandomUpTo(this.localDB.users.length);
    return this.localDB.users[id];
  }
  setLocalTestUser() {
    this.localTestUser = this.getRandomUserFromLocalDB();
  }
  wipeLocalDB() {
    this.localDB = {
      users: [],
      transactions: [],
    };
  }

  generateRandomTransaction(arrayOfUsers) {
    const from = arrayOfUsers[this.getRandomUpTo(arrayOfUsers.length - 1)];
    let to = arrayOfUsers[this.getRandomUpTo(arrayOfUsers.length - 1)];
    while (from.id === to.id) {
      to = arrayOfUsers[this.getRandomUpTo(arrayOfUsers.length - 1)];
    }
    const amount = this.getRandomUpTo(from.amount);
    return { from, to, amount };
  }

  addNewTransactionToLocalDB(transaction) {
    //Push new transaction to transaction's array in localDB
    this.localDB.transactions.push(transaction);
    //Change amount for sender and reciever

    let fromIndex;
    this.localDB.users.forEach((u, i) => {
      if (u.id === transaction.from) {
        fromIndex = i;
      }
    });
    this.localDB.users[fromIndex].amount -= transaction.amount;

    let toIndex;
    this.localDB.users.forEach((u, i) => {
      if (u.id === transaction.to) {
        toIndex = i;
      }
    });
    this.localDB.users[toIndex].amount += transaction.amount;
  }
}
export default LocalHeper;
