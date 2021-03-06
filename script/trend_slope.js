require('dotenv').config();
const Product = require('../server/models/admin_model');
const moment = require('moment'); // calculate time
const got = require('got'); // fetch page in server
const sendEmail = require('../util/mail');

async function insertData(historyData) {
  const result = await Product.getStockId();
  for (let i = 0; i < historyData.length; i++) {
    for (let j = 0; j < result.length; j++) {
      if (historyData[i].code === result[j].code) {
        historyData[i].code = result[j].id;
        break;
      }
    }
  }

  const insertDataLen = [];
  const insertData = [];
  for (let i = 0; i < historyData.length; i++) {
    if (typeof historyData[i].code !== 'string' ) {
      const index = [];
      const v = historyData[i].trend_slope;
      index.push(v);
      insertData.push(v);
      if (isNaN(Number(historyData[i].code))) {
        const c = 1;
        index.push(c);
        insertData.push(c);
      } else {
        const c = Number(historyData[i].code);
        index.push(c);
        insertData.push(c);
      }
      const d = Number(historyData[i].date);
      index.push(d);
      insertData.push(d);
      insertDataLen.push(index);
    }
  }
  await Product.insertTrendSlope(insertData, insertDataLen);
  return;
}

async function getData(date, URL) {
  const result = await got(URL);
  const data = JSON.parse(result.body);
  if (data.stat === 'OK') {
    const historyData = [];
    for (let i = 0; i < data.data9.length; i++) {
      const product = {};
      const mData = data.data9[i][9];
      const sign = mData.split('>')[1];
      if (sign !== undefined) {
        if (sign[0] === '+') {
          product.trend_slope = 1;
        } else if (sign[0] === '-') {
          product.trend_slope = -1;
        } else {
          product.trend_slope = 0;
        }
        product.code = data.data9[i][0];
        product.date = date.toString();
        historyData.push(product);
      }
    }
    console.log(date + ': ' + data.data9.length);

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

async function runTrendSlope() {
  try {
    for (let i = 0; i < 3650; i++) {
      const date = moment().subtract(i, 'days').format('YYYYMMDD');
      const URL = `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${date}&type=ALLBUT0999`;
      await getData(date, URL);
      await sleep(5000);
    }
    const msg = 'stock trend slope insert OK';
    sendEmail.sendEmail(msg);
    console.log('insert OK');
    return;
  } catch (err) {
    sendEmail.sendEmail(err);
    console.log(err);
    return;
  }
}

runTrendSlope();
