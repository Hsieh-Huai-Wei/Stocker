const { transaction, commit, rollback, query } = require("../../util/dbcon");

const singleProduct = async (searchInf) => {
  const result = await query(`SELECT * FROM fake WHERE stock_id = ? AND date BETWEEN ? AND ?`, [searchInf.code, searchInf.date, searchInf.today]);
  return result;
};

module.exports = {
  singleProduct,
};