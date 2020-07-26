const Product = require('../models/product_model')
// const request = require('request') // get webpage, json or xml ; GET or POST
// const request = require("request-promise-native");
// const cheerio = require("cheerio"); // analyze and get html structure
// const fs = require("fs"); // read file
// const moment = require("moment"); // calculate time
// const got = require("got"); // fetch page in server
// const csvjson = require("node-xlsx"); // read csv file

const product = async (req, res, next) => {
  console.log(req.body); // string
  if (req.body.stockCode !== '') {
    // today
    let today = new Date();
    let y = String((today.getFullYear()));
    let m = String((today.getMonth() + 1));
    let d = String((today.getDate()));
    if (m.length == 1) {
      m = "0" + m;
    }
    if (d.length == 1) {
      d = "0" + d;
    }
    let currentDateTime = y + m + d;
    let todayDate = Number(currentDateTime)

    // search information
    let newDate = '';
    if (req.body.date !== '') {
      let stringDate = req.body.date.split('-');
      for (let i = 0; i < stringDate.length; i++) {
        newDate += stringDate[i]
      }
    } else {
      newDate = currentDateTime;
    }
    let realDate = Number(newDate);
    // search sql
    let searchInf = {
      code: parseInt(req.body.stockCode),
      date: realDate,
      today: todayDate
    }
    console.log(searchInf)
    let result = await Product.singleProduct(searchInf);
  // console.log(result
  }
};





module.exports = {
  product,
};