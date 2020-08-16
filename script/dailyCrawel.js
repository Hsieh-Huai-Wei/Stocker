require('dotenv').config();
const Product = require('../server/models/admin_model');
const moment = require('moment'); // calculate time
const got = require('got'); // fetch page in server

// trend slope
async function insertTrendSlope(historyData) {
  const result = await Product.getStockId();
  for (let i = 0; i < historyData.length; i++) {
    for (let j = 0; j < result.length; j++) {
      if (historyData[i].code === result[j].code) {
        historyData[i].code = result[j].id;
        break;
      }
    }
  }

  let insertDataLen = [];
  let insertData = [];
  for (let i = 0; i < historyData.length; i++) {
    if (typeof historyData[i].code !== 'string') {
      let index = [];
      let v = historyData[i].trend_slope;
      index.push(v);
      insertData.push(v);
      if (isNaN(Number(historyData[i].code))) {
        let c = 1;
        index.push(c);
        insertData.push(c);
      } else {
        let c = Number(historyData[i].code);
        index.push(c);
        insertData.push(c);
      }
      let d = Number(historyData[i].date);
      index.push(d);
      insertData.push(d);
      insertDataLen.push(index);
    }
  }
  await Product.insertTrendSlope(insertData, insertDataLen);
  return;
}

async function getTrendSlope(date, URL) {
  let result = await got(URL);
  let data = JSON.parse(result.body);
  if (data.stat === 'OK') {
    let historyData = [];
    for (let i = 0; i < data.data9.length; i++) {
      let product = {};
      let mData = data.data9[i][9];
      let sign = mData.split('>')[1];
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

    await insertTrendSlope(historyData);
    return;
  } else {
    console.log(date, '沒有data');
  }
}

// legal volume
async function insertLegalData(historyData) {
  const result = await Product.getStockId();
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
  await Product.insertLegalData(sqlArr);
  return;
}

async function getLegalData(date, URL) {
  let result = await got(URL);
  let data = JSON.parse(result.body);
  if (data.stat === 'OK') {
    let historyData = [];
    if (Number(date) >= 20171218) {
      for (let i = 0; i < data.data.length; i++) {
        let product = {};
        if (data.data[i][0].length <= 4) {
          product.code = parseInt(data.data[i][0]);
          product.date = parseInt(date);
          if (data.data[i][7] !== '0') {
            let china = parseInt(data.data[i][4]);
            let foreign = parseInt(data.data[i][7]);
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
    }
    await insertLegalData(historyData);
    console.log(date + ': insert OK');
    return;
  } else {
    console.log(date, '沒有data');
  }
}

// stock price
async function insertPriceData(historyData) {
  const result = Product.getStockId();
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
  await Product.insertStockData(sqlArr);
  return;
}

async function getPriceData(date, URL) {
  let result = await got(URL);
  let data = JSON.parse(result.body);
  if (data.stat === 'OK') {
    let historyData = [];
    for (let i = 0; i < data.data9.length; i++) {
      let product = {};
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
      historyData.push(product);
    }
    console.log(date + ': ' + data.data9.length);
    await insertPriceData(historyData);
    return;
  } else {
    console.log(date, '沒有data');
  }
}

// crawler data
async function runDailyCrawler() {
  try {
    console.log('scheduleCronstyle:' + new Date());
    const date = moment().subtract(1, 'days').format('YYYYMMDD');
    console.log(date);
    const priceURL = `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${date}&type=ALLBUT0999`;
    await getPriceData(date, priceURL);
    console.log(`Date: ${date}, stock daily price inserted completed.`);
    await getTrendSlope(date, priceURL);
    console.log(`Date: ${date}, stock daily trend slope inserted completed.`);
    const legalURL = `https://www.twse.com.tw/fund/T86?response=json&date=${date}&selectType=ALLBUT0999`;
    await getLegalData(date, legalURL);
    console.log(`Date: ${date}, stock daily legal inserted completed.`);
  } catch (err) {
    console.log(err);
    return;
  }
}

module.exports = {
  runDailyCrawler,
};
