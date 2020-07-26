const User = require("../models/user_model");
const moment = require("moment"); // calculate time

const signin = async (req, res, next) => {

  let userSearch = {
    stockCode: req.body.stockCode,
    startDate: parseInt(req.body.startDate),
    endDate: parseInt(req.body.endDate),
  };
  console.log(userSearch); // string
  let historyPrice = await Product.singleProduct(userSearch);
  if (historyPrice.length !== 0) {
    let data = [];
    for (let i = 0; i < historyPrice.length; i++) {
      let index = {};
      index.date = historyPrice[i].date; // date
      index.code = historyPrice[i].code; // code
      index.name = historyPrice[i].name; // name
      index.open = historyPrice[i].open; // open
      index.high = historyPrice[i].high; // high
      index.low = historyPrice[i].low; // low
      index.close = historyPrice[i].close; // close
      if (historyPrice[i].close - historyPrice[i].open >= 0) {
        index.change = historyPrice[i].changes; // changes
        // index.percentChange = String((((historyPrice[i].close - historyPrice[i].open) / historyPrice[i].open) * 100).toFixed(2)); // changes %
      } else {
        index.change = "-" + String(historyPrice[i].changes); // changes
        // index.percentChange = "" + String((((historyPrice[i].close - historyPrice[i].open) / historyPrice[i].open) * 100).toFixed(2)); // changes %
      }
      index.percentChange = String((((historyPrice[i].close - historyPrice[i].open) / historyPrice[i].open) * 100).toFixed(2)); // changes %
      index.volume = historyPrice[i].volume; // volumn
      if (historyPrice[i]["5MA"] !== null) {
        index["5MA"] = historyPrice[i]["5MA"]; // 5MA
      } else {
        index["5MA"] = 0; // 5MA
      }
      data.push(index);
    }
    let result = {};
    result.data = data;
    res.send(result);
  } else {
    console.log("找不到");
  }
};

const signup = async (req, res, next) => {
  let historyDate = (req.body.end).toString()
  let count = req.body.count;
  // const date = moment(historyDate).subtract(3, "month").format("YYYYMMDD");
  const date = moment(historyDate).subtract(count, "day").format("YYYYMMDD");
  // console.log(date)
  let halfMonth = Number(date);

  let data = {
    start: halfMonth,
    end: parseInt(req.body.end),
    upper: parseInt(req.body.upper),
    lower: parseInt(req.body.lower),
    graph: req.body.graph,
    count: parseInt(req.body.count),
    increase: parseInt(req.body.increase + "%"),
    decrease: parseInt(req.body.decrease + "%"),
    rank: parseInt(req.body.rank),
    high: req.body.High,
    cross: req.body.cross,
  };

  // console.log("/////////////////////////////////////");
  let filter1 = await Product.option(data);
  // console.log(filter1)
  let stockPricePair = []; // id-[price] pair

  for (let i = 0; i < filter1.length; i++) {
    let item = stockPricePair.find(item => item.id === filter1[i].stock_id);
    if (item) {
      item["price"].push(filter1[i].close);
    } else {
      let index = {
        id: filter1[i].stock_id,
        price: [filter1[i].close],
      }
      stockPricePair.push(index);
    }
  }
  // console.log(stockPricePair)
  let graphFilter = [];

  for (let i = 0; i < stockPricePair.length; i++) {
    if (stockPricePair[i].price.length >= 3) {
      let len = stockPricePair[i].price.length
      let accArr = [];
      accArr.push(stockPricePair[i].price[0]);
      accArr.push(stockPricePair[i].price[len - 1]);
      maxRange = Math.max(...accArr);
      minRange = Math.min(...accArr);
      let accRange = [maxRange * 1.1, minRange * 0.9];
      let index = {};
      index.id = stockPricePair[i].id;
      let arr = stockPricePair[i].price

      // console.log(arr)
      // console.log(accRange[0])
      let big = arr.find(price => price > accRange[0])
      if (!big) {
        index.price = stockPricePair[i].price;
        graphFilter.push(index);
      } else {
        console.log("剔除 : ", stockPricePair[i].id)
      }
    }
  }

  // console.log("before",graphFilter.length)

  let passGraph = []
  // console.log(graphFilter);
  // console.log(graphFilter[0]);
  // console.log(graphFilter[0].price);
  for (let i = 0; i < graphFilter.length; i++) {
    let check = [];
    let maxLength = graphFilter[i].price.length;
    for (let j = 1; j < maxLength - 1; j++) {
      check.push(graphFilter[i].price)
    }
    let minPrice = Math.min(...check[0]);
    let userDecrease = ((graphFilter[i].price[0] - minPrice) / graphFilter[i].price[0]) * 100;
    let userIncrease = (Math.abs(minPrice - graphFilter[i].price[maxLength - 1]) / minPrice) * 100;
    // console.log("userDe", minPrice);
    // console.log("userIn", graphFilter[i].price[maxLength - 1]);
    // console.log("userDe", data.decrease);
    // console.log("userIn", data.increase);
    // console.log("priceDe", userDecrease);
    // console.log("priceIn", userIncrease);
    //跌多少以內 漲多少以內
    if (userDecrease <= data.decrease && userIncrease <= data.increase) {
      let index = {};
      index.id = graphFilter[i].id;
      index.price = graphFilter[i].price;
      passGraph.push(index)
    }
  }

  // console.log("after",passGraph.length)
  console.log(passGraph);
  let result = {};
  result.data = [];
  for (let i = 0; i < passGraph.length; i++) {
    let searchCode = {
      id: passGraph[i].id,
      start: halfMonth,
      end: parseInt(req.body.end),
    }
    let stockInf = await Product.filter(searchCode);
    if (stockInf.length !== 0) {
      let price = [];
      for (let i = 0; i < stockInf.length; i++) {
        let index = {};
        index.date = stockInf[i].date; // date
        index.code = stockInf[i].code; // code
        index.name = stockInf[i].name; // name
        index.open = stockInf[i].open; // open
        index.high = stockInf[i].high; // high
        index.low = stockInf[i].low; // low
        index.close = stockInf[i].close; // close
        if (stockInf[i].close - stockInf[i].open >= 0) {
          index.change = stockInf[i].changes; // changes
        } else {
          index.change = "-" + String(stockInf[i].changes); // changes
        }
        index.percentChange = String((((stockInf[i].close - stockInf[i].open) / stockInf[i].open) * 100).toFixed(2)); // changes %
        index.volume = stockInf[i].volume; // volumn
        if (stockInf[i]["5MA"] !== null) {
          index["5MA"] = stockInf[i]["5MA"]; // 5MA
        } else {
          index["5MA"] = 0; // 5MA
        }
        if (stockInf[i]["20MA"] !== null) {
          index["20MA"] = stockInf[i]["20MA"]; // 20MA
        } else {
          index["20MA"] = 0; // 20MA
        }
        if (stockInf[i]["60MA"] !== null) {
          index["60MA"] = stockInf[i]["60MA"]; // 60MA
        } else {
          index["60MA"] = 0; // 60MA
        }
        index.pe = stockInf[i].PE;
        index.mc = stockInf[i].MC;
        index.rsv = stockInf[i].RSV;
        index.k = stockInf[i].K;
        index.d = stockInf[i].D;
        index.dy = stockInf[i].DY;
        index.pb = stockInf[i].PB;
        index.fd = stockInf[i].FD;
        index.sitc = stockInf[i].SITC;
        index.dealers = stockInf[i].Dealers;
        index.total = stockInf[i].total;
        price.push(index);
      }
      result.data.push(
        {
          id: price[0].code,
          data: price
        }
      );
    } else {
      console.log("找不到");
    }
  }
  result.inf = data;
  res.send(result)
};

const profile = async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.body.length);
  // console.log(req.body[0]);
  // console.log(req.body[0].id);
  // console.log(req.body[0].data);
  let data = req.body[0].data;
  let caseInf = [];
  caseInf.push(parseInt(data.code));
  caseInf.push(parseInt(data.startDate));
  caseInf.push(parseInt(data.endDate));
  let caseResult = await Product.backTest(caseInf);
  let property = parseInt(data.property);
  let increase = parseInt(data.increase);
  let decrease = parseInt(data.decrease);
  let buy = parseInt(data.buy);
  let sell = parseInt(data.sell);
  let stock = 0;
  let result = [];
  for (let i = 0; i < caseResult.length; i++) {
    let list = {};
    if (property !== 0) {
      if (property !== 0 && caseResult[i].changes >= increase) {
        property -= (caseResult[i].close * buy);
        list.date = caseResult[i].date;
        list.property = property;
        list.buy = caseResult[i].close * buy;
        stock += buy;
        list.stock = stock
        result.push(list)
      } else if (caseResult[i].changes >= decrease) {
        property += (caseResult[i].close * sell);
        list.date = caseResult[i].date;
        list.property = property;
        list.sell = caseResult[i].close * sell;
        stock -= sell;
        list.stock = stock
        result.push(list)
      } else {
        property = property;
        list.date = caseResult[i].date;
        list.property = property;
        list.no = "no";
        result.push(list)
      }
    } else {
      if (stock !== 0) {
        if (caseResult[i].changes >= decrease) {
          property += (caseResult[i].close * sell);
          list.date = caseResult[i].date;
          list.property = property;
          list.sell = caseResult[i].close * sell;
          stock -= sell;
          list.stock = stock
          result.push(list)
        } else {
          property = property;
          list.date = caseResult[i].date;
          list.property = property;
          list.no = "no";
          result.push(list)
        }
      }
    }
  }
  let last = result.length;
  let finalProperty = result[last - 1].property;
  let finalStock = result[last - 1].stock;
  let finalClose = caseResult[last - 1].close;
  let profit = finalProperty + (finalStock * finalClose);
  let oringle = parseInt(data.property)
  console.log("股票庫存", finalStock);
  console.log("資產總額", profit);
  console.log("獲利率", ((profit - oringle) / oringle) * 100);
  console.log("淨賺", profit - oringle);
  let final = {
    data: data,
    result: {
      "股票庫存": finalStock,
      "資產總額": profit,
      "獲利率": ((profit - oringle) / oringle) * 100,
      "淨賺": profit - oringle,
    }
  }
  res.send(final)
}



module.exports = {
  signin,
  signup,
  profile,
};
