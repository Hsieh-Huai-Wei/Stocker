const { transaction, commit, rollback, query } = require("../../util/dbcon");

const singleStock = async (userSearch) => {
  if (isNaN(Number(userSearch.stockCode))) { //輸入中文
    const result = await query(`SELECT stock.history_price.*, stock.information.* FROM stock.history_price INNER JOIN information ON stock.history_price.stock_id = stock.information.id WHERE stock.information.name = ? AND stock.history_price.date BETWEEN ? AND ? ORDER BY date;`, [userSearch.stockCode, userSearch.startDate, userSearch.endDate]);
    return result;
  } else { // 輸入代碼
    const result = await query(`SELECT stock.history_price.*, stock.information.* FROM stock.history_price INNER JOIN information ON stock.history_price.stock_id = stock.information.id WHERE stock.information.code = ? AND stock.history_price.date BETWEEN ? AND ? ORDER BY date;`, [parseInt(userSearch.stockCode), userSearch.startDate, userSearch.endDate]);
    return result;
  }
};

const option = async (data) => {
  const result = await query(`SELECT * FROM stock.history_price WHERE(date between ? and ?) AND (close between ? and ?) ORDER BY stock_id, date DESC;`, [data.start, data.end, data.lower, data.upper]);
  return result;
};

const filterInit = async (data) => {
  const result = await query(`SELECT * FROM stock.history_price WHERE(date between ? and ?) AND (close between ? and ?) ORDER BY stock_id, date;`, [data.start, data.end, data.lower, data.upper]);
  return result;
};

// const filterInit = async (data) => {
//   const result = await query(`SELECT * FROM stock.history_price WHERE(date between ? and ?) AND (close between ? and ?) AND (stock_id = 1980) ORDER BY  date;`, [data.start, data.end, data.lower, data.upper]);
//   return result;
// };

const filter = async (data) => {
  const result = await query(`SELECT stock.history_price.*, stock.information.code, stock.information.name, stock.information.industry, stock.legal.FD, stock.legal.SITC, stock.legal.Dealers, stock.legal.total FROM stock.information
INNER JOIN stock.history_price ON stock.history_price.stock_id = stock.information.id
INNER JOIN stock.legal ON stock.legal.stock_id = stock.information.id AND stock.legal.date = stock.history_price.date
WHERE stock.information.id = ? AND stock.history_price.date BETWEEN ? AND ?;`, [data.id, data.start, data.end]);
  return result;
};

const backTest = async (data) => {
  const result = await query(`SELECT stock.history_price.*, stock.information.* FROM stock.information 
INNER JOIN stock.history_price ON stock.history_price.stock_id = stock.information.id WHERE (code = ?) AND (date between ? and ?) ORDER BY date;`,data);
  return result;
}


module.exports = {
  singleStock,
  option,
  filter,
  backTest,
  filterInit,
};


// SELECT stock.history_price.*, stock.information.*, stock.legal.* FROM stock.information
// INNER JOIN stock.history_price ON stock.history_price.stock_id = stock.information.id
// INNER JOIN stock.legal ON stock.legal.stock_id = stock.information.id AND stock.legal.date = stock.history_price.date
// WHERE stock.information.code = 2059 AND stock.history_price.date BETWEEN 20200701 AND 20200703;