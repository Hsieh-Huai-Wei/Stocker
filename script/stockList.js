require('dotenv').config();
const Product = require('../server/models/admin_model');
const request = require('request-promise');
const iconv = require('iconv-lite');
const cheerio = require('cheerio'); // analyze and get html structure
const sendEmail = require('../util/mail');

// catch stock name and code
const url = 'https://isin.twse.com.tw/isin/C_public.jsp?strMode=2';
const options = {
  uri: url,
  encoding: null,
  transform: function (body) {
    const html = iconv.decode(body, 'Big5');
    return cheerio.load(html);
  },
};

request(options) //18184 - 0050 //18309 - 00878
  .then(async function ($) {
    const table_tr = $('.h4 tbody tr');
    const data = [];
    for (let i = 18184; i < 18310; i++) {
      const index = [];
      index.push(table_tr.eq(i).find('td').eq(0).text().split('　')[0]);
      index.push(table_tr.eq(i).find('td').eq(0).text().split('　')[1]);
      index.push(table_tr.eq(i).find('td').eq(4).text());
      data.push(index);
    }
    await Product.createStocklist(data);
    const msg = 'Stock List created OK !!';
    sendEmail.sendEmail(msg);
    console.log('Stock List created OK !!');
  })
  .catch(function (err) {
    const msg = err;
    sendEmail.sendEmail(msg);
    console.log(err);
  });