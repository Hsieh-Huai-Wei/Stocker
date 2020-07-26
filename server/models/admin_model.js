const { transaction, commit, rollback, query } = require("../../util/dbcon");

const historyprice = async (historyData) => {
  try {
    const result = await query(`SELECT id, code FROM information`);
    let sqlArr = [];
    for (let i = 0; i < historyData.length; i++) {
      for (let j = 0; j < result.length; j++) {
        if (historyData[i].code === result[j].code) {
          historyData[i].code = result[j].id;
          let arr = Object.values(historyData[i]);
          sqlArr.push(arr);
          break;
        }
      }
    }
    await query(`INSERT INTO history_price (stock_id, date, volume, open, high, low, close, changes, PE) VALUES ?;`, [sqlArr]);
    return; 
  } catch (err) {
    throw err;
  }
};


module.exports = {
  historyprice,
};