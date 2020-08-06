const Product = require('../models/stock_model');
const User = require('../models/user_model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = 'secret';
const moment = require('moment'); // calculate time

function dateCheck(start, end) {

  return new Promise((resolve) => {
    console.log(start)
    const startString = start.split('-');
    const startTime = startString[0] + startString[1] + startString[2];
    const endString = end.split('-');
    const endTime = endString[0] + endString[1] + endString[2];
    let result = {
      start: parseInt(startTime),
      end: parseInt(endTime),
    };
    console.log(result)
    resolve(result);
    return;
  });
}

function uptrend(userSearch, stockPricePair) {

  // 找到圖形符合之型態
  let graphPosition = [];
  // 對全部股票進行掃描
  for (let i = 0; i < stockPricePair.length; i++) {
    console.log('i', i);
    // 對單一股票的歷史價格進行掃描
    let r = Number(userSearch.count);
    let increase = Number(userSearch.increase);

    for (let j = 0; j < stockPricePair[i].data.length - r; j++) {
      let stockIndex = stockPricePair[i].data;
      let firstDay = stockIndex[j];
      let lastDay = stockIndex[j + r - 1];
      let upCount = 0;

      let check = true;
      for (let u = 1; u < r - 1; u++) {
        if (
          firstDay.close > stockIndex[j + u].close ||
          lastDay.close < stockIndex[j + u].close
        ) {
          check = false;
          break;
        }
      }

      if ((lastDay.close - firstDay.close) / firstDay < increase) {
        check = false;
        break;
      }

      if (check === true) {
        let stockIndexLength =
          stockPricePair[i].data.length - j > r - 1
            ? r
            : stockPricePair[i].data.length - j;

        // 從第0個到最高點是否close是否都大於第0個且m=-1佔7成
        for (let k = 1; k < stockIndexLength; k++) {
          if (
            firstDay.close < stockIndex[k].close &&
            stockIndex[k].m === 1 &&
            stockIndex[k - 1].close <= stockIndex[k].close
          ) {
            upCount += 1;
          }
        }

        if (upCount / r > 0.7) {
          let index = {};
          index.id = stockPricePair[i].id;
          index.startDate = firstDay.date;
          index.startPrice = firstDay.close;
          index.endDate = lastDay.date;
          index.endPrice = lastDay.close;

          graphPosition.push(index);

          j = j + r;
        }
      }
    }
  }

  // 剔除不符合條件的 stock
  let finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    let item = finalStockPricePair.find(
      (item) => item.id === graphPosition[i].id
    );
    if (item) {
      item['trend'].push({
        startDate: graphPosition[i].startDate,
        startPrice: graphPosition[i].startPrice,
        endDate: graphPosition[i].endDate,
        endPrice: graphPosition[i].endPrice,
      });
    } else {
      let index = {
        id: graphPosition[i].id,
        trend: [
          {
            startDate: graphPosition[i].startDate,
            startPrice: graphPosition[i].startPrice,
            endDate: graphPosition[i].endDate,
            endPrice: graphPosition[i].endPrice,
          },
        ],
      };
      finalStockPricePair.push(index);
    }
  }
  return finalStockPricePair;
}

function downtrend(userSearch, stockPricePair) {
  // 找到圖形符合之型態
  let graphPosition = [];
  // 對全部股票進行掃描
  for (let i = 0; i < stockPricePair.length; i++) {
    console.log('i', i);
    // 對單一股票的歷史價格進行掃描
    let r = Number(userSearch.count);
    let decrease = Number(userSearch.decrease);

    for (let j = 0; j < stockPricePair[i].data.length - r; j++) {
      let stockIndex = stockPricePair[i].data;
      let firstDay = stockIndex[j];
      let lastDay = stockIndex[j + r - 1];
      let upCount = 0;

      let check = true;
      for (let u = 1; u < r - 1; u++) {
        if (
          firstDay.close < stockIndex[j + u].close ||
          lastDay.close > stockIndex[j + u].close
        ) {
          check = false;
          break;
        }
      }

      if ((firstDay.close - lastDay.close) / firstDay < decrease) {
        check = false;
        break;
      }

      if (check === true) {
        let stockIndexLength =
          stockPricePair[i].data.length - j > r - 1
            ? r
            : stockPricePair[i].data.length - j;

        // 從第0個到最高點是否close是否都大於第0個且m=-1佔7成
        for (let k = 1; k < stockIndexLength; k++) {
          if (
            firstDay.close < stockIndex[k].close &&
            stockIndex[k].m === -1 &&
            stockIndex[k - 1].close >= stockIndex[k].close
          ) {
            upCount += 1;
          }
        }

        if (upCount / r > 0.5) {
          let index = {};
          index.id = stockPricePair[i].id;
          index.startDate = firstDay.date;
          index.startPrice = firstDay.close;
          index.endDate = lastDay.date;
          index.endPrice = lastDay.close;

          graphPosition.push(index);

          j = j + r;
        }
      }
    }
  }
  // 剔除不符合條件的 stock
  let finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    let item = finalStockPricePair.find(
      (item) => item.id === graphPosition[i].id
    );
    if (item) {
      item['trend'].push({
        startDate: graphPosition[i].startDate,
        startPrice: graphPosition[i].startPrice,
        endDate: graphPosition[i].endDate,
        endPrice: graphPosition[i].endPrice,
      });
    } else {
      let index = {
        id: graphPosition[i].id,
        trend: [
          {
            startDate: graphPosition[i].startDate,
            startPrice: graphPosition[i].startPrice,
            endDate: graphPosition[i].endDate,
            endPrice: graphPosition[i].endPrice,
          },
        ],
      };
      finalStockPricePair.push(index);
    }
  }

  return finalStockPricePair;
}

function reverseV(userSearch, stockPricePair) {

  // 找到圖形符合之型態
  // 對全部股票進行掃描
  // 對單一股票的歷史價格進行掃描
  // 30 day    3 day
  // 180 day    6 day
  // 360 day    9 day
  // 找出最小值的位置與close
  // 從第0個到最低點是否close是否都小於第0個且m=-1佔7成
  // 從最低點到最後一個是否close是否都大於最低點且m=1佔7成
  // 將0、最低點、最後一個的start與end打包成index塞入array
  // 整理array

  // 找到圖形符合之型態
  let graphPosition = [];
  // 對全部股票進行掃描
  for (let i = 0; i < stockPricePair.length; i++) {
    console.log('i', i);
    // 對單一股票的歷史價格進行掃描
    console.log(userSearch);
    let r = Number(userSearch.count);
    let low = Math.floor(r / 2) - 2;
    let up = Math.floor(r / 2) + 2;
    for (let j = 0; j < stockPricePair[i].data.length - r; j++) {

      let stockIndex = stockPricePair[i].data;
      let firstDay = stockIndex[j];
      let lastDay = stockIndex[j + r - 1];
      let lowCount = 0;
      let upCount = 0;

      let check = true;

      for (let u = 1; u < r - 1; u++) {
        if (
          firstDay.close < stockIndex[j + u].close ||
          lastDay.close < stockIndex[j + u].close
        ) {
          check = false;
          break;
        }
      }

      for (let u = low; u < up; u++) {
        if (
          (firstDay.close * 5) / 6 < stockIndex[j + u].close ||
          (lastDay.close * 5) / 6 < stockIndex[j + u].close
        ) {
          check = false;
          break;
        }
      }

      if (check === true) {
        // 確認左右平衡點
        if (
          firstDay.close * 0.1 < lastDay.close &&
          lastDay.close < firstDay.close * 2
        ) {

          // 找出中間的位置與close;
          let minDay = firstDay;
          let minPosition = 0;
          let stockIndexLength =
            stockPricePair[i].data.length - j > r - 1
              ? r
              : stockPricePair[i].data.length - j;
          for (let k = 1; k < stockIndexLength; k++) {
            // console.log(stockIndex[j + k].close)
            if (minDay.close > stockIndex[j + k].close) {
              minDay = stockIndex[j + k];
              minPosition = k;
            }
          }

          if (minPosition !== 0) {
            // 從第0個到最低點是否close是否都小於第0個且m=-1佔7成
            for (let k = 1; k < minPosition; k++) {
              if (
                firstDay.close > stockIndex[k].close &&
                stockIndex[k].m === -1 &&
                lastDay.close > stockIndex[k].close
              ) {
                lowCount += 1;
              }
            }
            // 從最低點到最後一個是否close是否都大於最低點且m=1佔7成
            for (let k = minPosition; k < stockIndexLength; k++) {
              if (
                minDay.close < stockIndex[k].close &&
                stockIndex[k].m === 1 &&
                lastDay.close >= stockIndex[k].close &&
                firstDay.close > stockIndex[k].close
              ) {
                upCount += 1;
              }
            }

            if (upCount / minPosition > 0.5 && lowCount / minPosition > 0.5) {

              let index = {};
              index.id = stockPricePair[i].id;
              index.startDate = firstDay.date;
              index.startPrice = firstDay.close;
              index.endDate = minDay.date;
              index.endPrice = minDay.close;
              graphPosition.push(index);

              let indexs = {};
              indexs.id = stockPricePair[i].id;
              indexs.startDate = minDay.date;
              indexs.startPrice = minDay.close;
              indexs.endDate = lastDay.date;
              indexs.endPrice = lastDay.close;
              graphPosition.push(indexs);

              j = j + r;

            }
          }
        }
      }
    }
  }

  // 剔除不符合條件的 stock
  let finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    let item = finalStockPricePair.find(
      (item) => item.id === graphPosition[i].id
    );
    if (item) {
      item['trend'].push({
        startDate: graphPosition[i].startDate,
        startPrice: graphPosition[i].startPrice,
        endDate: graphPosition[i].endDate,
        endPrice: graphPosition[i].endPrice,
      });
    } else {
      let index = {
        id: graphPosition[i].id,
        trend: [
          {
            startDate: graphPosition[i].startDate,
            startPrice: graphPosition[i].startPrice,
            endDate: graphPosition[i].endDate,
            endPrice: graphPosition[i].endPrice,
          },
        ],
      };
      finalStockPricePair.push(index);
    }
  }
  return finalStockPricePair;
}

function noGraph(stockPricePair) {

  let graphPosition = stockPricePair;

  // 剔除不符合條件的 stock
  let finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    let item = finalStockPricePair.find(
      (item) => item.id === graphPosition[i].id
    );
    if (item) {
      item['trend'].push({
        startDate: 0,
        startPrice: 0,
        endDate: 0,
        endPrice: 0,
      });
    } else {
      let index = {
        id: graphPosition[i].id,
        trend: [
          {
            startDate: 0,
            startPrice: 0,
            endDate: 0,
            endPrice: 0,
          },
        ],
      };
      finalStockPricePair.push(index);
    }
  }
  return finalStockPricePair;
}

const stock = async (req, res, next) => {

  let userSearch = {
    stockCode: req.query.code,
    startDate: req.query.start,
    endDate: req.query.end,
  };

  const startString = (moment(userSearch.startDate).subtract(50, 'day').format('YYYYMMDD'));
  const endString = (moment(userSearch.endDate).format('YYYYMMDD'));
  userSearch.startDate = Number(startString);
  userSearch.endDate = Number(endString);
  let historyPrice = await Product.stock(userSearch);
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
      } else {
        index.change = '-' + String(historyPrice[i].changes); // changes
      }
      index.percentChange = String((((historyPrice[i].close - historyPrice[i].open) / historyPrice[i].open) * 100).toFixed(2)); // changes %

      let volumeSql = (historyPrice[i].volume).split(',');
      let volumeNum = '';
      for (let i = 0; i < volumeSql.length; i++) {
        volumeNum += volumeSql[i];
      }
      index.volume = Number(volumeNum); // volumn
      data.push(index);
    }
    let result = {};
    result.data = data;
    res.send(result);
  } else {
    res.status(400).send({ error: 'Cannot find stock or Error stock code/name' });
  }
};

const option = async (req, res, next) => {

  let userSearch = {
    start: req.query.startDate,
    end: req.query.endDate,
    upper: req.query.upper,
    lower: req.query.lower,
    graph: req.query.graph,
    count: req.query.count,
    increase: req.query.increase,
    decrease: req.query.decrease,
  };

  // 對 "價格區間" 與 "日期" 對 DB 進行篩選

  let date = await dateCheck(userSearch.start, userSearch.end);
  userSearch.start = date.start;
  userSearch.end = date.end;
  let filterInit = await Product.filterInit(userSearch);

  // 進行 "圖形判斷"，取需要的值(顧客需求的天數與 % 數)，進行 array- object 排列

  // 先將資料預處理 id-[price] pair
  let stockPricePair = []; // id-[price] pair

  for (let i = 0; i < filterInit.length; i++) {
    let item = stockPricePair.find(item => item.id === filterInit[i].stock_id);
    if (item) {
      item['data'].push(
        {
          date: filterInit[i].date,
          open: filterInit[i].open,
          close: filterInit[i].close,
          changes: filterInit[i].changes,
          m: filterInit[i].m,
        }
      );
    } else {
      let index = {
        id: filterInit[i].stock_id,
        data: [
          {
            date: filterInit[i].date,
            open: filterInit[i].open,
            close: filterInit[i].close,
            changes: filterInit[i].changes,
            m: filterInit[i].m,
          }
        ],
      };
      stockPricePair.push(index);
    }
  }

  // 進行圖形分類判斷

  let finalStockPricePair;

  if (userSearch.graph === 'na') {
    finalStockPricePair = noGraph(userSearch, stockPricePair);
  } else if (userSearch.graph === 'reverseV') {
    finalStockPricePair = reverseV(userSearch, stockPricePair);
  } else if (userSearch.graph === 'uptrend') {
    finalStockPricePair = uptrend(userSearch, stockPricePair);
  } else if (userSearch.graph === 'downtrend') {
    finalStockPricePair = downtrend(userSearch, stockPricePair);
  } else if (userSearch.graph === 'test') {
    finalStockPricePair = test(userSearch, stockPricePair);
  } else {
    finalStockPricePair = stockPricePair;
  }

  console.log(finalStockPricePair);
  // 找最終符合條件的 stock 回傳
  let filterCode = [];
  let result = {};
  result.data = [];
  for (let i = 0; i < finalStockPricePair.length; i++) {
    let searchCode = {
      id: finalStockPricePair[i].id,
      start: userSearch.start,
      end: userSearch.end,
    };
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
          index.change = '-' + String(stockInf[i].changes); // changes
        }
        index.percentChange = String((((stockInf[i].close - stockInf[i].open) / stockInf[i].open) * 100).toFixed(2)); // changes %

        let volumeSql = stockInf[i].volume.split(',');
        let volumeNum = '';
        for (let i = 0; i < volumeSql.length; i++){
          volumeNum += volumeSql[i];
        }
        index.volume = Number(volumeNum); // volumn
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
        index.industry = stockInf[i].industry;
        price.push(index);
      }

      result.data.push(
        {
          id: price[0].code,
          data: price,
        }
      );
      filterCode.push({
        stock_code: stockInf[i].code,
        stock_id: stockInf[i].stock_id
      });
    } else {
      console.log('找不到');
    }
  }

  for (let i = 0; i < finalStockPricePair.length; i++) {
    for (let j = 0; j < filterCode.length; j++) {
      if (finalStockPricePair[i].id === filterCode[j].stock_id){
        finalStockPricePair[i].id = filterCode[j].stock_code;
      }
    }
  }

  for (let i = 0; i < result.data.length; i++) {
    for (let j = 0; j < finalStockPricePair.length; j++) {
      if (result.data[i].id === finalStockPricePair[j].id) {
        result.data[i]['trend'] = finalStockPricePair[j]['trend'];
      }
    }
  }


  result.inf = userSearch;
  console.log(result);

  res.send(result);
};

const backTest = async (req, res, next) => {

  let data = [];
  for (let i = 0; i < req.body.length; i++) {

    let stockData = req.body[i].data;
    //找歷史資料
    let caseInf = [];
    caseInf.push(parseInt(stockData.code));
    caseInf.push(parseInt(stockData.startDate));
    caseInf.push(parseInt(stockData.endDate));
    console.log(caseInf);
    let caseResult = await Product.backTest(caseInf);
    //帶入參數
    let propertyInit = parseInt(stockData.property);
    let property = parseInt(stockData.property);

    let increaseAct = stockData.increaseAct; // 漲 要買還是賣
    let decreaseAct = stockData.decreaseAct; // 跌 要買還是賣
    let increase = parseInt(stockData.increase); //漲 %
    let decrease = parseInt(stockData.decrease); //跌 %
    let increaseCount = parseInt(stockData.increaseCount); // 張
    let decreaseCount = parseInt(stockData.decreaseCount); // 張

    let discount = (parseInt(stockData.discount)) / 100;
    let buyCostPercent = 0.001425;
    let sellCostPercent = 0.003;



    let stock = 0;
    let tradeCost = 0;
    let history = [];

    for (let i = 0; i < caseResult.length; i++) {
      if (caseResult[i].changes >= increase) {
        if (increaseAct === 'buy' && property > caseResult[i].close) {
          let list = {};
          // 購買手續費
          let buyCost = caseResult[i].close * increaseCount * buyCostPercent * discount;
          list.profitPercent = (((property + (stock * caseResult[i].close)) - buyCost) - propertyInit).toFixed(2);
          // 累積交易成本
          tradeCost += buyCost;
          // 庫存stock數量
          stock += increaseCount;
          // 總資產扣除
          property = property - buyCost - (caseResult[i].close * increaseCount);
          list.information = caseResult[i].date;
          list.situation = increaseAct;
          list.price = caseResult[i].close;
          list.stock = stock;
          list.value = caseResult[i].close;
          list.tradeCost = Number((buyCost).toFixed(2));
          list.property = Number((property + (caseResult[i].close * stock)).toFixed(2));
          history.push(list);
        } else if (increaseAct === 'sell' && stock > 0) {
          let list = {};
          // 賣出手續費
          let sellCost = (caseResult[i].close * increaseCount * buyCostPercent * discount) + (caseResult[i].close * increaseCount * sellCostPercent);

          list.profitPercent = (((property + (stock * caseResult[i].close)) - sellCost) - propertyInit).toFixed(2);

          // 累積交易成本
          tradeCost += sellCost;
          // 庫存stock數量
          stock -= increaseCount;

          // 總資產扣除
          property = property - sellCost + (caseResult[i].close * increaseCount);

          list.information = caseResult[i].date;
          list.situation = increaseAct;
          list.price = caseResult[i].close;
          list.stock = stock;
          list.value = caseResult[i].close;
          list.tradeCost = Number((sellCost).toFixed(2));
          list.property = Number((property + (caseResult[i].close * stock)).toFixed(2));
          history.push(list);
        }

      } else if (caseResult[i].changes <= decrease) {
        if (decreaseAct === 'buy' && property > caseResult[i].close) {
          let list = {};
          // 購買手續費
          let buyCost = caseResult[i].close * decreaseCount * buyCostPercent * discount;
          list.profitPercent = (((property + (stock * caseResult[i].close)) - buyCost) - propertyInit).toFixed(2);
          // 累積交易成本
          tradeCost += buyCost;
          // 庫存stock數量
          stock += decreaseCount;

          // 總資產扣除
          property = property - buyCost - (caseResult[i].close * decreaseCount);

          list.information = caseResult[i].date;
          list.situation = decreaseAct;
          list.price = caseResult[i].close;
          list.stock = stock;
          list.value = caseResult[i].close;
          list.tradeCost = Number((buyCost).toFixed(2));
          list.property = Number((property + (caseResult[i].close * stock)).toFixed(2));
          history.push(list);
        } else if (decreaseAct === 'sell' && stock > 0) {
          let list = {};
          // 賣出手續費
          let sellCost = (caseResult[i].close * decreaseCount * buyCostPercent * discount) + (caseResult[i].close * decreaseCount * sellCostPercent);

          list.profitPercent = (((property + (stock * caseResult[i].close)) - sellCost) - propertyInit).toFixed(2);

          // 累積交易成本
          tradeCost += sellCost;
          // 庫存stock數量
          stock -= decreaseCount;

          // 總資產扣除
          property = property - sellCost + (caseResult[i].close * decreaseCount);

          list.information = caseResult[i].date;
          list.situation = decreaseAct;
          list.price = caseResult[i].close;
          list.stock = stock;
          list.value = caseResult[i].close;
          list.tradeCost = Number((sellCost).toFixed(2));
          list.property = Number((property + (caseResult[i].close * stock)).toFixed(2));
          history.push(list);
        }

      }
    }

    let len = caseResult.length;
    let caseData = {
      case: stockData,
      summary: {
        finalStock: stock,
        stockValue: (caseResult[len - 1].close),
        totalAssets: Number(((property + (stock * caseResult[len - 1].close))).toFixed(2)),
        tradeCost: Number((tradeCost).toFixed(2)),
        earningRate: Number(((((property + (stock * caseResult[len - 1].close)) - parseInt(stockData.property)) / parseInt(stockData.property)) * 100).toFixed(2)),
        income: Number(((property + (stock * caseResult[len - 1].close)) - parseInt(stockData.property)).toFixed(2)),
      },
      history: history,
      condition: stockData,
    };

    data.push(caseData);
  }
  console.log({data});
  res.send({data});
};

module.exports = {
  option,
  backTest,
  stock,
};
