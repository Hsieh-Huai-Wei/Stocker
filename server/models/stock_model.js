const { transaction, commit, rollback, query } = require('../../util/dbcon');

const stock = async (userSearch) => {
  if (isNaN(Number(userSearch.stockCode))) { //輸入中文
    const result = await query('SELECT stock.history_price.*, stock.information.* FROM stock.history_price INNER JOIN information ON stock.history_price.stock_id = stock.information.id WHERE stock.information.name = ? AND stock.history_price.date BETWEEN ? AND ? ORDER BY date;', [userSearch.stockCode, userSearch.startDate, userSearch.endDate]);
    return result;
  } else { // 輸入代碼
    const result = await query('SELECT stock.history_price.*, stock.information.* FROM stock.history_price INNER JOIN information ON stock.history_price.stock_id = stock.information.id WHERE stock.information.code = ? AND stock.history_price.date BETWEEN ? AND ? ORDER BY date;', [parseInt(userSearch.stockCode), userSearch.startDate, userSearch.endDate]);
    return result;
  }
};

const option = async (data) => {
  const result = await query('SELECT * FROM stock.history_price WHERE(date between ? and ?) AND (close between ? and ?) ORDER BY stock_id, date DESC;', [data.start, data.end, data.lower, data.upper]);
  return result;
};

const filterInit = async (data) => {
  const result = await query('SELECT * FROM stock.history_price WHERE(date between ? and ?) AND (close between ? and ?) ORDER BY stock_id, date;', [data.start, data.end, data.lower, data.upper]);
  return result;
};

const filter = async (data) => {
  const result = await query(`SELECT stock.history_price.*, stock.information.code, stock.information.name, stock.information.industry, stock.legal.fi_count, stock.legal.sitc_count, stock.legal.dealers_count, stock.legal.total FROM stock.information
  INNER JOIN stock.history_price ON stock.history_price.stock_id = stock.information.id
  INNER JOIN stock.legal ON stock.legal.stock_id = stock.information.id AND stock.legal.date = stock.history_price.date
  WHERE stock.information.id = ? AND stock.history_price.date BETWEEN ? AND ?;`, [data.id, data.start, data.end]);
  return result;
};

const backTest = async (data) => {
  const result = await query(`SELECT stock.history_price.*, stock.information.* FROM stock.information 
INNER JOIN stock.history_price ON stock.history_price.stock_id = stock.information.id WHERE (code = ?) AND (date between ? and ?) ORDER BY date;`,data);
  return result;
};

const filterHistory = async (data) => {
  const result = await query('SELECT stock.information.name, stock.filter_history.*, stock.user.id, stock.user.email FROM stock.user INNER JOIN stock.filter_history ON stock.filter_history.user_id = stock.user.id INNER JOIN stock.information ON stock.information.code = stock.filter_history.stock_code WHERE stock.user.email = ?;', [data.email]);
  return result;
};

const backTestHistory = async (data) => {
  const result = await query('SELECT stock.information.name, stock.backtest_summary.*, stock.user.id, stock.user.email FROM stock.user INNER JOIN stock.backtest_summary ON stock.backtest_summary.user_id = stock.user.id INNER JOIN stock.information ON stock.information.code = stock.backtest_summary.stock_code WHERE stock.user.email = ?;', [data.email]);
  return result;
};

module.exports = {
  stock,
  option,
  filter,
  backTest,
  filterInit,
  filterHistory,
  backTestHistory,
};


// SELECT stock.history_price.*, stock.information.*, stock.legal.* FROM stock.information
// INNER JOIN stock.history_price ON stock.history_price.stock_id = stock.information.id
// INNER JOIN stock.legal ON stock.legal.stock_id = stock.information.id AND stock.legal.date = stock.history_price.date
// WHERE stock.information.code = 2059 AND stock.history_price.date BETWEEN 20200701 AND 20200703;