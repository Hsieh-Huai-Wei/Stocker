const { query } = require('../../util/dbcon');

const createStocklist = async (data) => {
  const result = await query('INSERT INTO information (code, name, industry) VALUES ?', [data]);
  return result;
};

const getStockId = async () => {
  const result = await query('SELECT id, code FROM information');
  return result;
};

const insertStockData = async (data) => {
  const result = await query('INSERT INTO history_price (stock_id, date, volume, open, high, low, close, changes, pe, trend_slope) VALUES ?;', [data]);
  return result;
};

const insertLegalData = async (data) => {
  const result = await query('INSERT INTO legal (stock_id, date, fi_count, sitc_count, dealers_count, total) VALUES ? ;',
    [data]);
  return result;
};

const insertTrendSlope = async (data, len) => {
  let sql = '';
  for (let i = 0; i < len.length; i++) {
    sql += 'UPDATE history_price SET trend_slope = ? WHERE stock_id = ? AND date = ? ; ';
  }
  await query(sql, data);
  return;
};

module.exports = {
  createStocklist,
  getStockId,
  insertStockData,
  insertLegalData,
  insertTrendSlope,
};