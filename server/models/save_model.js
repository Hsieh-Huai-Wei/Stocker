const { transaction, commit, rollback, query } = require('../../util/dbcon');

const filter = async (data) => {
    const result = await query('INSERT INTO stock.filter_history SET ?;', data);
    return result;
};

const summary = async (searchInf) => {
  const result = await query('INSERT INTO stock.backtest_summary SET ?;', [searchInf]);
  return result;
};


module.exports = {
  filter,
  summary,
};