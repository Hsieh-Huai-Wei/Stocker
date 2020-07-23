require("dotenv").config();
const mysql = require("mysql");
const request = require("request-promise");
const iconv = require("iconv-lite");
const cheerio = require("cheerio"); // analyze and get html structure
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

const stocklist = async (results) => {
  // console.log(results)
  const result = await query(`INSERT INTO information (code, name, industry) VALUES ?`, [results]);
  return result;
};

// 讀取上市股票名稱與代碼
const url = "https://isin.twse.com.tw/isin/C_public.jsp?strMode=2";
let options = {
  uri: url,
  encoding: null,
  transform: function (body) {
    const html = iconv.decode(body, "Big5");
    return cheerio.load(html);
  },
};

request(options)
  .then(async function ($) {
    const table_tr = $(".h4 tbody tr");
    let data = [];
    for (let i = 2; i < 946; i++) {
      let index = [];
      index.push(table_tr.eq(i).find("td").eq(0).text().split("　")[0]);
      index.push(table_tr.eq(i).find("td").eq(0).text().split("　")[1]);
      index.push(table_tr.eq(i).find("td").eq(4).text());
      data.push(index);
    }
    await stocklist(data);
    console.log("Stock List create OK !!")
  })
  .catch(function (err) {
    console.log(err);
  });

// request(options)
//   .then(function ($) {
//     const table_tr = $(".h4 tbody tr");
//     let data = [];
//     for (let i = 2; i < 946; i++) {
//       let index = [];
//       index.push(table_tr.eq(i).find("td").eq(0).text().split("　")[0]);
//       index.push(table_tr.eq(i).find("td").eq(0).text().split("　")[1]);
//       index.push(table_tr.eq(i).find("td").eq(4).text());
//       data.push(index);
//     }
//     return stocklist(data);
//   }).then((data)=>{
//     console.log(data);
//     console.log("Stock List create OK !!")
//     )
//   .catch(function (err) {
//     console.log(err);
//   });