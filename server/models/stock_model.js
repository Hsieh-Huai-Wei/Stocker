const { query } = require('../../util/dbcon');

const stock = async (userSearch) => {
  if (isNaN(Number(userSearch.stockCode))) { // key in name
    const result = await query('SELECT stock.history_price.*, stock.information.* FROM stock.history_price INNER JOIN information ON stock.history_price.stock_id = stock.information.id WHERE stock.information.name = ? AND stock.history_price.date BETWEEN ? AND ? ORDER BY date;', [userSearch.stockCode, userSearch.startDate, userSearch.endDate]);
    return result;
  } else { // key in code
    const result = await query('SELECT stock.history_price.*, stock.information.* FROM stock.history_price INNER JOIN information ON stock.history_price.stock_id = stock.information.id WHERE stock.information.code = ? AND stock.history_price.date BETWEEN ? AND ? ORDER BY date;', [parseInt(userSearch.stockCode), userSearch.startDate, userSearch.endDate]);
    return result;
  }
};

const option = async (data) => {
  const result = await query('SELECT * FROM stock.history_price WHERE(date between ? and ?) AND (close between ? and ?) ORDER BY stock_id, date DESC;', [data.start, data.end, data.lower, data.upper]);
  return result;
};

const filterInit = async (data) => {
  const result = await query('SELECT information.code, history_price.date, history_price.open, history_price.close, history_price.changes, history_price.trend_slope FROM information INNER JOIN history_price ON information.id = stock.history_price.stock_id WHERE(history_price.date between ? and ?) AND (stock.history_price.close between ? and ?) AND information.id < 2833 ORDER BY stock_id desc, date asc;', [data.start, data.end, data.lower, data.upper]);
  return result;
};

const filter = async (data) => {
  const result = await query(`SELECT stock.history_price.*, stock.information.code, stock.information.name, stock.information.industry, stock.legal.fi_count, stock.legal.sitc_count, stock.legal.dealers_count, stock.legal.total FROM stock.information
  INNER JOIN stock.history_price ON stock.history_price.stock_id = stock.information.id
  INNER JOIN stock.legal ON stock.legal.stock_id = stock.information.id AND stock.legal.date = stock.history_price.date
  WHERE stock.information.code in (?) AND stock.history_price.date BETWEEN ? AND ?  order by stock_id, date;`, data);
  return result;
};

const backTest = async (data) => {
  if (isNaN(Number(data[0]))) {
    const result = await query(`SELECT stock.history_price.*, stock.information.* FROM stock.information 
  INNER JOIN stock.history_price ON stock.history_price.stock_id = stock.information.id WHERE (name = ?) AND (date between ? and ?) ORDER BY date;`, data);
    return result;
  } else {
    const result = await query(`SELECT stock.history_price.*, stock.information.* FROM stock.information 
  INNER JOIN stock.history_price ON stock.history_price.stock_id = stock.information.id WHERE (code = ?) AND (date between ? and ?) ORDER BY date;`, data);
    return result;
  }
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