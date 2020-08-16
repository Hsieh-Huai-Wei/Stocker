require('dotenv').config();
const Product = require('../server/models/admin_model');
const request = require('request-promise');
const iconv = require('iconv-lite');
const cheerio = require('cheerio'); // analyze and get html structure

// catch stock name and code
const url = 'https://isin.twse.com.tw/isin/C_public.jsp?strMode=2';
let options = {
  uri: url,
  encoding: null,
  transform: function (body) {
    const html = iconv.decode(body, 'Big5');
    return cheerio.load(html);
  },
};

request(options)
  .then(async function ($) {
    const table_tr = $('.h4 tbody tr');
    let data = [];
    for (let i = 2; i < 946; i++) {
      let index = [];
      index.push(table_tr.eq(i).find('td').eq(0).text().split('　')[0]);
      index.push(table_tr.eq(i).find('td').eq(0).text().split('　')[1]);
      index.push(table_tr.eq(i).find('td').eq(4).text());
      data.push(index);
    }
    await Product.createStocklist(data);
    console.log('Stock List created OK !!');
  })
  .catch(function (err) {
    console.log(err);
  });