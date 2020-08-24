require('dotenv').config();
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

module.exports = {
  mysqlConfig: mysqlConfig,
};
