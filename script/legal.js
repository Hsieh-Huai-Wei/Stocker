require("dotenv").config();
const mysql = require("mysql");
const moment = require("moment"); // calculate time
const got = require("got"); // fetch page in server
const { promisify } = require("util"); // util from native nodejs library
const e = require("express");
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
        if (historyData[i].code === parseInt(result[j].code)) {
          historyData[i].code = result[j].id;
          let arr = Object.values(historyData[i]);
          sqlArr.push(arr);
          break;
        }
      }
    }
    await query(
      `INSERT INTO legal (stock_id, date, FD, SITC, Dealers, Total) VALUES ? ;`,
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
    // note: 陸外資合併用
    for (let i = 0; i < data.data.length; i++) {
      let product = {};
      if (data.data[i][0].length <= 4) {
        product.code = parseInt(data.data[i][0]);
        product.date = parseInt(date);
        product.fd = data.data[i][4];
        product.sitc = data.data[i][7];
        product.dealers = data.data[i][8];
        product.total = data.data[i][11];
        historyData.push(product);
      }
    }
    await insertData(historyData);
    console.log(date + ": insert OK");
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

// note: 106-12-18 當天開始分開至今
// note: 106-12-15 以前都是合併
async function run() {
  try {
    // for (let i = 6; i < 936; i++) {// 6 --> 2020/07/03
    // for (let i = 2050; i < 3650; i++) {
    for (let i = 1; i < 11; i++) {
      //20200323
      const date = moment().subtract(i, "days").format("YYYYMMDD");
      console.log(i, date);
      const URL = `https://www.twse.com.tw/fund/T86?response=json&date=${date}&selectType=ALLBUT0999`;
      await gotData(date, URL);
      await sleep(5000);
    }
    console.log("insert OK");
    return;
  } catch (err) {
    // console.log(err);
    console.log("NOOOOOOOOOOOOOOOOOOOOO");
    // res.send("internal err");
    return;
  }
}

run();

// note: 陸外資分開用
// for (let i = 0; i < data.data.length; i++) {
//   let product = {};
//   if (data.data[i][0].length <= 4) {
//     product.code = parseInt(data.data[i][0]);
//     product.date = parseInt(date);
//     if (data.data[i][7] !== "0") {
//       let china = parseInt(data.data[i][4]);
//       let foreign = parseInt(data.data[i][7]);;
//       product.fd = (china + foreign).toString();
//     } else {
//       product.fd = data.data[i][4];
//     }
//     product.sitc = data.data[i][10];
//     product.dealers = data.data[i][11];
//     if (product.total === null) {
//       console.log(data.data[i][0])
//     } else {
//       product.total = data.data[i][18];
//     }
//     historyData.push(product);
//   }
// }
