require("dotenv").config();
const mysql = require("mysql");
const moment = require("moment"); // calculate time
const got = require("got"); // fetch page in server
const { promisify } = require("util"); // util from native nodejs library
const { HOST, USERNAME2, PASSWORD, DATABASE } = process.env;

// DB connection
const con = mysql.createConnection({
  host: HOST, // MYSQL HOST NAME
  user: USERNAME2, // MYSQL USERNAME
  password: PASSWORD, // MYSQL PASSWORD
  database: DATABASE, // MYSQL DB NAME
});

con.connect(function (err) {
  if (err) throw err;
  console.log("DB Connected!");
});

const query = (query, bindings) => {
  return promisify(con.query).bind(con)(query, bindings);
};

async function insertData(historyData) {
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
    await query(
      `INSERT INTO history_price (stock_id, date, volume, open, high, low, close, changes, PE) VALUES ?;`,
      [sqlArr]
    );
    return;
  } catch (err) {
    throw err;
  }
}

async function gotData(date, URL) {
  let result = await got(URL);
  let data = JSON.parse(result.body);
  if (data.stat === "OK") {
    let historyData = [];
    for (let i = 0; i < data.data9.length; i++) {
      let product = {};
      product.code = data.data9[i][0];
      product.date = parseInt(date);
      product.volumn = data.data9[i][2];
      if (data.data9[i][5] === "--") {
        product.open = parseFloat(0);
        product.high = parseFloat(0);
        product.low = parseFloat(0);
        product.close = parseFloat(0);
      } else {
        product.open = parseFloat(data.data9[i][5]);
        product.high = parseFloat(data.data9[i][6]);
        product.low = parseFloat(data.data9[i][7]);
        product.close = parseFloat(data.data9[i][8]);
      }
      product.change = parseFloat(data.data9[i][10]);
      product.pe = parseFloat(data.data9[i][15]);
      historyData.push(product);
    }
    console.log(date + ": " + data.data9.length);
    await insertData(historyData);
    return;
  } else {
    console.log(date, "沒有data");
  }
}

async function sleep(millis) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, millis)
  );
}

// note: 20110729 is data8
async function run() {
  try {
    // for (let i = 0; i < 1; i++) {
    for (let i = 1; i < 17; i++) {
      const date = moment().subtract(i, "days").format("YYYYMMDD");
      console.log(date);
      const URL = `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${date}&type=ALLBUT0999`;
      await gotData(date, URL);
      await sleep(5000);
    }
    console.log("insert OK");
    return;
  } catch (err) {
    console.log(err);
    // res.send("internal err");
    return;
  }
}

run();
