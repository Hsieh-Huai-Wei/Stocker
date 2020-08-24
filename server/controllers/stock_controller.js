const Product = require('../models/stock_model');
const moment = require('moment'); // calculate time

function dateCheck(start, end) {
  return new Promise((resolve) => {
    const startString = start.split('-');
    const startTime = startString[0] + startString[1] + startString[2];
    const endString = end.split('-');
    const endTime = endString[0] + endString[1] + endString[2];
    const result = {
      start: parseInt(startTime),
      end: parseInt(endTime),
    };
    resolve(result);
    return;
  });
}

function uptrend(userSearch, stockPricePair) {
  // find graph for match
  const graphPosition = [];
  // scan all of stock
  for (let i = 0; i < stockPricePair.length; i++) {
    // scan history price of single stock
    const r = Number(userSearch.count);
    const increase = Number(userSearch.increase);

    for (let j = 0; j < stockPricePair[i].data.length - r; j++) {
      const stockIndex = stockPricePair[i].data;
      const firstDay = stockIndex[j];
      const lastDay = stockIndex[j + r - 1];
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
        const stockIndexLength =
          stockPricePair[i].data.length - j > r - 1
            ? r
            : stockPricePair[i].data.length - j;

        // check m=1 over 70% from 0 to high
        for (let k = 1; k < stockIndexLength; k++) {
          if (
            firstDay.close < stockIndex[k].close &&
            stockIndex[k].trend_slope === 1 &&
            stockIndex[k - 1].close <= stockIndex[k].close
          ) {
            upCount += 1;
          }
        }

        if (upCount / r > 0.7) {
          const obj = {};
          obj.id = stockPricePair[i].id;
          obj.startDate = firstDay.date;
          obj.startPrice = firstDay.close;
          obj.endDate = lastDay.date;
          obj.endPrice = lastDay.close;

          graphPosition.push(obj);

          j = j + r;
        }
      }
    }
  }

  // drop doesn`t match stock
  const finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    const item = finalStockPricePair.find(
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
      const index = {
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
  // find graph for match
  const graphPosition = [];
  // scan all of stock
  for (let i = 0; i < stockPricePair.length; i++) {
    // scan history price of single stock
    const r = Number(userSearch.count);
    const decrease = Number(userSearch.decrease);
    for (let j = 0; j < stockPricePair[i].data.length - r; j++) {
      const stockIndex = stockPricePair[i].data;
      const firstDay = stockIndex[j];
      const lastDay = stockIndex[j + r - 1];
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
        const stockIndexLength =
          stockPricePair[i].data.length - j > r - 1
            ? r
            : stockPricePair[i].data.length - j;

        // check m=-1 over 70% from 0 to high
        for (let k = 1; k < stockIndexLength; k++) {
          if (
            firstDay.close < stockIndex[k].close &&
            stockIndex[k].trend_slope === -1 &&
            stockIndex[k - 1].close >= stockIndex[k].close
          ) {
            upCount += 1;
          }
        }

        if (upCount / r > 0.5) {
          const index = {};
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
  // drop no match stock
  const finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    const item = finalStockPricePair.find(
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
      const index = {
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
  // find graph for match
  const graphPosition = [];
  // scan all of stock
  for (let i = 0; i < stockPricePair.length; i++) {
    // scan history price of single stock
    const r = Number(userSearch.count);
    const low = Math.floor(r / 2) - 2;
    const up = Math.floor(r / 2) + 2;
    for (let j = 0; j < stockPricePair[i].data.length - r; j++) {

      const stockIndex = stockPricePair[i].data;
      const firstDay = stockIndex[j];
      const lastDay = stockIndex[j + r - 1];
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
        // check balance
        if (
          firstDay.close * 0.1 < lastDay.close &&
          lastDay.close < firstDay.close * 2
        ) {

          // find middle point and close;
          let minDay = firstDay;
          let minPosition = 0;
          const stockIndexLength =
            stockPricePair[i].data.length - j > r - 1
              ? r
              : stockPricePair[i].data.length - j;
          for (let k = 1; k < stockIndexLength; k++) {
            if (minDay.close > stockIndex[j + k].close) {
              minDay = stockIndex[j + k];
              minPosition = k;
            }
          }

          if (minPosition !== 0) {
            // check m=-1 more than 70% from 0 to middle point
            for (let k = 1; k < minPosition; k++) {
              if (
                firstDay.close > stockIndex[k].close &&
                stockIndex[k].trend_slope === -1 &&
                lastDay.close > stockIndex[k].close
              ) {
                lowCount += 1;
              }
            }
            // check m=1 more than 70% from middle point to last one
            for (let k = minPosition; k < stockIndexLength; k++) {
              if (
                minDay.close < stockIndex[k].close &&
                stockIndex[k].trend_slope === 1 &&
                lastDay.close >= stockIndex[k].close &&
                firstDay.close > stockIndex[k].close
              ) {
                upCount += 1;
              }
            }

            if (upCount / minPosition > 0.5 && lowCount / minPosition > 0.5) {

              const objLeft = {};
              objLeft.id = stockPricePair[i].id;
              objLeft.startDate = firstDay.date;
              objLeft.startPrice = firstDay.close;
              objLeft.endDate = minDay.date;
              objLeft.endPrice = minDay.close;
              graphPosition.push(objLeft);

              const objRight = {};
              objRight.id = stockPricePair[i].id;
              objRight.startDate = minDay.date;
              objRight.startPrice = minDay.close;
              objRight.endDate = lastDay.date;
              objRight.endPrice = lastDay.close;
              graphPosition.push(objRight);

              j = j + r;

            }
          }
        }
      }
    }
  }
  // drop no match stock
  const finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    const item = finalStockPricePair.find(
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
      const index = {
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

  const graphPosition = stockPricePair;

  // drop no match stock
  const finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    const item = finalStockPricePair.find(
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
      const index = {
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

  const userSearch = {
    stockCode: req.query.code,
    startDate: req.query.start,
    endDate: req.query.end,
  };

  const startString = (moment(userSearch.startDate).subtract(50, 'day').format('YYYYMMDD'));
  const endString = (moment(userSearch.endDate).format('YYYYMMDD'));
  userSearch.startDate = Number(startString);
  userSearch.endDate = Number(endString);
  const historyPrice = await Product.stock(userSearch);
  if (historyPrice.length !== 0) {
    const data = [];
    for (let i = 0; i < historyPrice.length; i++) {
      const index = {};
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

      const volumeSql = (historyPrice[i].volume).split(',');
      let volumeNum = '';
      for (let i = 0; i < volumeSql.length; i++) {
        volumeNum += volumeSql[i];
      }
      index.volume = Number(volumeNum); // volumn
      data.push(index);
    }
    const result = {};
    result.data = data;
    res.send(result);
  } else {
    res.status(400).send({ error: 'Cannot find stock or Error stock code/name' });
  }
};

const option = async (req, res, next) => {
  const userSearch = {
    start: req.query.startDate,
    end: req.query.endDate,
    upper: req.query.upper,
    lower: req.query.lower,
    graph: req.query.graph,
    count: req.query.count,
    increase: req.query.increase,
    decrease: req.query.decrease,
  };
  // scan date range and price range
  const date = await dateCheck(userSearch.start, userSearch.end);
  userSearch.start = date.start;
  userSearch.end = date.end;
  const filterInit = await Product.filterInit(userSearch);

  // graph check and get day count and %, sort by arr-obj
  // pre-sort to id-[price] pair
  const stockPricePair = []; // id-[price] pair
  for (let i = 0; i < filterInit.length; i++) {
    const item = stockPricePair.find(item => item.id === filterInit[i].stock_id);
    if (item) {
      item['data'].push(
        {
          date: filterInit[i].date,
          open: filterInit[i].open,
          close: filterInit[i].close,
          changes: filterInit[i].changes,
          trend_slope: filterInit[i].trend_slope,
        }
      );
    } else {
      const index = {
        id: filterInit[i].stock_id,
        data: [
          {
            date: filterInit[i].date,
            open: filterInit[i].open,
            close: filterInit[i].close,
            changes: filterInit[i].changes,
            trend_slope: filterInit[i].trend_slope,
          }
        ],
      };
      stockPricePair.push(index);
    }
  }
  // define graph
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
  // final stock
  const filterCode = [];
  const result = {};
  result.data = [];

  for (let i = 0; i < finalStockPricePair.length; i++) {

    const searchCode = {
      id: finalStockPricePair[i].id,
      start: userSearch.start,
      end: userSearch.end,
    };
    const stockInf = await Product.filter(searchCode);
    if (stockInf.length !== 0) {
      const price = [];
      for (let i = 0; i < stockInf.length; i++) {
        const obj = {};
        obj.date = stockInf[i].date; // date
        obj.code = stockInf[i].code; // code
        obj.name = stockInf[i].name; // name
        obj.open = stockInf[i].open; // open
        obj.high = stockInf[i].high; // high
        obj.low = stockInf[i].low; // low
        obj.close = stockInf[i].close; // close
        if (stockInf[i].close - stockInf[i].open >= 0) {
          obj.change = stockInf[i].changes; // changes
        } else {
          obj.change = '-' + String(stockInf[i].changes); // changes
        }
        obj.percentChange = String((((stockInf[i].close - stockInf[i].open) / stockInf[i].open) * 100).toFixed(2)); // changes %

        const volumeSql = stockInf[i].volume.split(',');
        let volumeNum = '';
        for (let i = 0; i < volumeSql.length; i++){
          volumeNum += volumeSql[i];
        }
        obj.volume = Number(volumeNum); // volumn
        obj.pe = stockInf[i].pe;
        obj.fd = stockInf[i].fi_count;
        obj.sitc = stockInf[i].sitc_count;
        obj.dealers = stockInf[i].dealers_count;
        obj.total = stockInf[i].total;
        obj.industry = stockInf[i].industry;
        price.push(obj);
      }

      result.data.push(
        {
          id: price[0].code,
          data: price,
        }
      );
      if (stockInf[i] !== undefined) {
        filterCode.push({
          stock_code: stockInf[i].code,
          stock_id: stockInf[i].stock_id
        });
      }
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
  res.send(result);
};

const backTest = async (req, res, next) => {

  const data = [];
  for (let i = 0; i < req.body.length; i++) {

    const stockData = req.body[i].data;
    //search history price
    const caseInf = [];
    caseInf.push(stockData.code);
    caseInf.push(parseInt(stockData.startDate));
    caseInf.push(parseInt(stockData.endDate));
    const caseResult = await Product.backTest(caseInf);
    if (caseResult.length === 0) {
      res.status(400).send({ error: '查無此股票或此日期區間無股價!' });
    }
    // insert parameter
    const propertyInit = parseInt(stockData.property);
    let property = parseInt(stockData.property);

    const increaseAct = stockData.increaseAct; // increase : buy or sell
    const decreaseAct = stockData.decreaseAct; // decrease : buy or sell
    const increase = parseInt(stockData.increase); //increase %
    const decrease = parseInt(stockData.decrease); //decrease %
    const increaseCount = parseInt(stockData.increaseCount); // count
    const decreaseCount = parseInt(stockData.decreaseCount); // count
    const discount = (parseInt(stockData.discount)) / 100;
    const buyCostPercent = 0.001425;
    const sellCostPercent = 0.003;

    let stock = 0;
    let tradeCost = 0;
    const history = [];

    for (let i = 0; i < caseResult.length; i++) {
      if (caseResult[i].changes >= increase) {
        if (increaseAct === 'buy' && property > caseResult[i].close) {
          const list = {};
          // handling fee for buy
          const buyCost = caseResult[i].close * increaseCount * buyCostPercent * discount;
          list.profitPercent = (((property + (stock * caseResult[i].close)) - buyCost) - propertyInit).toFixed(2);
          // trade cost
          tradeCost += buyCost;
          // stock count
          stock += increaseCount;
          // property
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
          const list = {};
          // handling fee for sell
          const sellCost = (caseResult[i].close * increaseCount * buyCostPercent * discount) + (caseResult[i].close * increaseCount * sellCostPercent);

          list.profitPercent = (((property + (stock * caseResult[i].close)) - sellCost) - propertyInit).toFixed(2);

          // trade cost
          tradeCost += sellCost;
          // stock count
          stock -= increaseCount;

          // property
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
          const list = {};
          // handling fee for buy
          const buyCost = caseResult[i].close * decreaseCount * buyCostPercent * discount;
          list.profitPercent = (((property + (stock * caseResult[i].close)) - buyCost) - propertyInit).toFixed(2);
          // trade cost
          tradeCost += buyCost;
          // stock count
          stock += decreaseCount;

          // property
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
          const list = {};
          // handling fee for sell
          const sellCost = (caseResult[i].close * decreaseCount * buyCostPercent * discount) + (caseResult[i].close * decreaseCount * sellCostPercent);

          list.profitPercent = (((property + (stock * caseResult[i].close)) - sellCost) - propertyInit).toFixed(2);

          // trade cost
          tradeCost += sellCost;
          // stock count
          stock -= decreaseCount;

          // property
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
    if (history.length === 0) {
      res.status(400).send({ error: '無任何交易產生，請重新選擇條件' });
    }
    const len = caseResult.length;
    const caseData = {
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
  res.status(200).send({ data });
};

module.exports = {
  option,
  backTest,
  stock,
};
