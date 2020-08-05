const { transaction, commit, rollback, query } = require('../../util/dbcon');

const signUpCheck = async (data) => {
  const result = await query('SELECT * FROM user WHERE email = ?', [data.email]);
  return result;
};

const signUp = async (data) => {
  const result = await query('INSERT INTO user SET number = ?, name = ?, email = ?, password = ?, picture = ?, provider_id = ?, access_token = ?, access_expired = ?', [data.id, data.name, data.email, data.pwd, data.pic, data.provider, data.token, data.date]);
  return result;
};

const signInCheck = async (data) => {
  const result = await query('SELECT * FROM user WHERE email = ? AND password = ?', [data.email, data.pwd]);
  return result;
};

const signInUpdate = async (data) => {
  const result = await query('UPDATE user SET access_token = ?, access_expired = ? WHERE email = ?', [data.token, data.date, data.email]);
  return result;
};

const signIn = async (data) => {
  const result = await query('SELECT number AS id, provider_id AS provider, name, email, picture FROM user WHERE email = ?', [data.email]);
    return result;
};

const profile = async (data) => {
  const result = await query('SELECT id, number, provider_id AS provider, name, email, picture FROM user WHERE email = ? AND access_token = ?', [data.email, data.token]);
  return result;
};

module.exports = {
  signUpCheck,
  signInCheck,
  signInUpdate,
  signIn,
  signUp,
  profile,
};