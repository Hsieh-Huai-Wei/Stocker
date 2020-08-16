require('dotenv').config();
const mysql = require('mysql');
const { promisify } = require('util'); // util from native nodejs library
const env = process.env.NODE_ENV || 'production';
const multipleStatements = process.env.NODE_ENV === 'test';
const { HOST, USERNAME2, PASSWORD, DATABASE, DATABASE_TEST } = process.env;

const mysqlConfig = {
  production: {
    // for EC2 machine
    host: HOST, // MYSQL HOST NAME
    user: USERNAME2, // MYSQL USERNAME
    password: PASSWORD, // MYSQL PASSWORD
    database: DATABASE, // MYSQL DB NAME
    multipleStatements: true,
  },
  development: {
    // for localhost development
    host: HOST, // MYSQL HOST NAME
    user: USERNAME2, // MYSQL USERNAME
    password: PASSWORD, // MYSQL PASSWORD
    database: DATABASE, // MYSQL DB NAME
    multipleStatements: true,
  },
  test: {
    // for automation testing (command: npm run test)
    host: HOST,
    user: USERNAME2,
    password: PASSWORD,
    database: DATABASE_TEST,
    multipleStatements: true,
  },
};

// DB connection
const con = mysql.createConnection(mysqlConfig[env], {
  multipleStatements
});

con.connect(function (err) {
  if (err) throw err;
  if (env == 'test') {
    console.log('DB_test Connected!');
  } else {
    console.log('DB Connected!');
  }
});

const promiseQuery = (query, bindings) => {
  return promisify(con.query).bind(con)(query, bindings);
};

const promiseTransaction = promisify(con.beginTransaction).bind(con);
const promiseCommit = promisify(con.commit).bind(con);
const promiseRollback = promisify(con.rollback).bind(con);
const promiseEnd = promisify(con.end).bind(con);

module.exports = {
  con: con,
  query: promiseQuery,
  transaction: promiseTransaction,
  commit: promiseCommit,
  rollback: promiseRollback,
  end: promiseEnd,
};
