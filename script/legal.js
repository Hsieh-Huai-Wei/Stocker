require('dotenv').config();
const Product = require('../server/models/admin_model');
const moment = require('moment'); // calculate time
const got = require('got'); // fetch page in server
const sendEmail = require('../util/mail');

async function insertData(historyData) {
  const result = await Product.getStockId();
  const sqlArr = [];
  for (let i = 0; i < historyData.length; i++) {
    for (let j = 0; j < result.length; j++) {
      if (historyData[i].code === parseInt(result[j].code)) {
        historyData[i].code = result[j].id;
        const arr = Object.values(historyData[i]);
        sqlArr.push(arr);
        break;
      }
    }
  }
  await Product.insertLegalData(sqlArr);
  return;
}

async function getData(date, URL) {
  const result = await got(URL);
  const data = JSON.parse(result.body);
  if (data.stat === 'OK') {
    const historyData = [];
    if (Number(date) >= 20171218) {
      for (let i = 0; i < data.data.length; i++) {
        const product = {};
        if (data.data[i][0].length <= 4) {
          product.code = parseInt(data.data[i][0]);
          product.date = parseInt(date);
          if (data.data[i][7] !== '0') {
            const china = parseInt(data.data[i][4]);
            const foreign = parseInt(data.data[i][7]);
            product.fd = (china + foreign).toString();
          } else {
            product.fd = data.data[i][4];
          }
          product.sitc = data.data[i][10];
          product.dealers = data.data[i][11];
          if (product.total === null) {
            console.log(data.data[i][0]);
          } else {
            product.total = data.data[i][18];
          }
          historyData.push(product);
        }
      }
    } else {
      for (let i = 0; i < data.data.length; i++) {
        const product = {};
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
    }
    await insertData(historyData);
    return;
  } else {
    console.log(date, '沒有data');
  }
}

async function sleep(millis) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, millis)
  );
}

// note: after 106-12-18 separation
// note: before 106-12-15 combine
async function runCrawler() {
  try {
    for (let i = 0; i < 5; i++) {
      const date = moment().subtract(i, 'days').format('YYYYMMDD');
      const URL = `https://www.twse.com.tw/fund/T86?response=json&date=${date}&selectType=ALLBUT0999`;
      await getData(date, URL);
      await sleep(5000);
    }
    const msg = 'stock legal insert OK';
    sendEmail.sendEmail(msg);
    console.log('insert OK');
    return;
  } catch (err) {
    sendEmail.sendEmail(err);
    console.log(err);
    return;
  }
}

runCrawler();