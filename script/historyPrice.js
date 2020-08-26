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
      if (historyData[i].code === result[j].code) {
        historyData[i].code = result[j].id;
        const arr = Object.values(historyData[i]);
        sqlArr.push(arr);
        break;
      }
    }
  }
  await Product.insertStockData(sqlArr);
  return;
}

async function getDataNew(date, URL) {
  const result = await got(URL);
  const data = JSON.parse(result.body);
  if (data.stat === 'OK') {
    const historyData = [];
    for (let i = 0; i < data.data9.length; i++) {
      const product = {};
      product.code = data.data9[i][0];
      product.date = parseInt(date);
      product.volumn = data.data9[i][2];
      if (data.data9[i][5] === '--') {
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
      product.trend_slope = 0;
      historyData.push(product);
    }
    console.log(date + ': ' + data.data9.length);
    await insertData(historyData);
    return;
  } else {
    console.log(date, '沒有data');
  }
}

async function getDataOld(date, URL) {
  const result = await got(URL);
  const data = JSON.parse(result.body);
  if (data.stat === 'OK') {
    const historyData = [];
    for (let i = 0; i < data.data8.length; i++) {
      const product = {};
      product.code = data.data8[i][0];
      product.date = parseInt(date);
      product.volumn = data.data8[i][2];
      if (data.data8[i][5] === '--') {
        product.open = parseFloat(0);
        product.high = parseFloat(0);
        product.low = parseFloat(0);
        product.close = parseFloat(0);
      } else {
        product.open = parseFloat(data.data8[i][5]);
        product.high = parseFloat(data.data8[i][6]);
        product.low = parseFloat(data.data8[i][7]);
        product.close = parseFloat(data.data8[i][8]);
      }
      product.change = parseFloat(data.data8[i][10]);
      product.pe = parseFloat(data.data8[i][15]);
      product.trend_slope = 0;
      historyData.push(product);
    }
    console.log(date + ': ' + data.data8.length);
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

async function runCrawler() { //20110729
  try {
    for (let i = 3315; i < 3650; i++) {
      const date = moment().subtract(i, 'days').format('YYYYMMDD');
      const URL = `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${date}&type=ALLBUT0999`;
      console.log(date)
      if (Number(date) - 20110729 <= 0) {
        await getDataOld(date, URL);
      } else {
        await getDataNew(date, URL);
      }
      await sleep(5000);
    }
    const msg = 'stock history price insert OK';
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
