require('dotenv').config();
const {NODE_ENV} = process.env;
const crypto = require('crypto');
const {
  users,
} = require('./fake_data');


const {query, end} = require('../util/dbcon');

function _createFakeUser () {
  const encryped_users = users.map(user => {
    const encryped_user = {
        number: user.number,
        name: user.name,
        email: user.email,
        password: user.password ? crypto.createHash('sha256').update(user.password).digest('hex') : null,
        picture: user.picture,
        provider_id: user.provider_id,
        access_token: user.access_token,
        access_expired: user.access_expired,
    };
    return encryped_user;
  });
  return query('INSERT INTO user (number, name, email, password, picture, provider_id, access_token, access_expired) VALUES ?',
    [encryped_users.map((x) => Object.values(x))]
  );
}

function createFakeData() {
    if (NODE_ENV !== 'test') {
      console.log('Not in test env');
      return;
    }

    return _createFakeUser()
      .catch(console.log);
}

function truncateFakeData() {
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }

    console.log('truncate fake data');
    const setForeignKey = (status) => {
        return query('SET FOREIGN_KEY_CHECKS = ?', status);
    };

    const truncateTable = (table) => {
        return query(`TRUNCATE TABLE ${table}`);
    };

    return setForeignKey(0)
        .then(truncateTable('user'))
        .then(setForeignKey(1))
        .catch(console.log);
}

function closeConnection() {
    return end();
}

module.exports = {
    createFakeData,
    truncateFakeData,
    closeConnection,
};