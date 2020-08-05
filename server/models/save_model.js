const { transaction, commit, rollback, query } = require('../../util/dbcon');

const filter = async (data) => {
    const result = await query('INSERT INTO stock.filter_history SET ?;', data);
    return result;
};

const backTest = async (searchInf) => {
  const result = await query('SELECT * FROM fake WHERE stock_id = ? AND date BETWEEN ? AND ?', [searchInf.code, searchInf.date, searchInf.today]);
  return result;
};


module.exports = {
  filter,
  backTest,
};