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

function filterPricePair(graphPosition) {
  const finalStockPricePair = new Array;
  let obj = {};
  for (let i = 0; i < graphPosition.length; i ++) {
    if (finalStockPricePair.length > 50) break;
    const currentId = graphPosition[i].id;
    const nextId = graphPosition[i+1] ? graphPosition[i+1].id : '';
    if(Number(currentId) > 2832) continue;
    if (!obj.id) {
      obj.id = currentId;
      obj.trend = new Array;
    }
    obj.trend.push(graphPosition[i]);

    if (nextId !== currentId) {
      finalStockPricePair.push(obj);
      obj = new Object;
    }
  }
  return finalStockPricePair;
}

function uptrend(userSearch, stockPricePair) {
  // find graph for match
  const graphPosition = new Array;
  // scan all of stock
  stockPricePair.forEach((pair)=>{
    // scan history price of single stock
    const userRange = Number(userSearch.count);
    const increase = Number(userSearch.increase);

    for (let j = 0; j < pair.data.length - userRange; j++) {
      const stockIndex = pair.data;
      const firstDay = stockIndex[j];
      const lastDay = stockIndex[j + userRange - 1];
      let upCount = 0;

      let check = true;
      const checkGraphArr = [firstDay];
      for (let u = 1; u < userRange; u++) {
        if (
          firstDay.close > stockIndex[j + u].close ||
          lastDay.close < stockIndex[j + u].close
        ) {
          check = false;
          break;
        } else {
          checkGraphArr.push(stockIndex[j + u]);
        }
      }
      checkGraphArr.push(lastDay);
      if ((lastDay.close - firstDay.close) / firstDay < increase) {
        check = false;
        break;
      }

      if (check) {
        // check m=1 over 70% from 0 to high
        for (let k = 1; k < checkGraphArr.length; k++) {
          if (
            checkGraphArr[0].close < checkGraphArr[k].close &&
            checkGraphArr[k].trend_slope === 1 &&
            checkGraphArr[k - 1].close <= checkGraphArr[k].close
          ) {
            upCount += 1;
          }
        }

        if (upCount / userRange > 0.7) {
          const obj = new Object;
          obj.id = pair.id;
          obj.startDate = firstDay.date;
          obj.startPrice = firstDay.close;
          obj.endDate = lastDay.date;
          obj.endPrice = lastDay.close;
          graphPosition.push(obj);
          j += userRange;
        }
      }
    }
  });

  return filterPricePair(graphPosition);
}

function downtrend(userSearch, stockPricePair) {
  // find graph for match
  const graphPosition = new Array;
  // scan all of stock
  stockPricePair.forEach((pair)=>{
    // scan history price of single stock
    const userRange = Number(userSearch.count);
    const decrease = Number(userSearch.decrease);
    for (let j = 0; j < pair.data.length - userRange; j++) {
      const stockIndex = pair.data;
      const firstDay = stockIndex[j];
      const lastDay = stockIndex[j + userRange - 1];

      let check = true;
      const checkGraphArr = [firstDay];
      for (let u = 1; u < userRange - 1; u++) {
        if (
          firstDay.close < stockIndex[j + u].close ||
          lastDay.close > stockIndex[j + u].close
        ) {
          check = false;
          break;
        } else {
          checkGraphArr.push(stockIndex[j + u]);
        }
      }
      checkGraphArr.push(lastDay);
      if ((firstDay.close - lastDay.close) / firstDay < decrease) {
        check = false;
        break;
      }

      if (check) {

        const obj = new Object;
        obj.id = pair.id;
        obj.startDate = firstDay.date;
        obj.startPrice = firstDay.close;
        obj.endDate = lastDay.date;
        obj.endPrice = lastDay.close;

        graphPosition.push(obj);

        j += userRange;
      }
    }
  });
  return filterPricePair(graphPosition);
}

function reverseV(userSearch, stockPricePair) {
  // find graph for match
  const graphPosition = new Array;
  // scan all of stock
  stockPricePair.forEach((pair)=>{
    // scan history price of single stock
    const userRange = Number(userSearch.count);
    const low = Math.floor(userRange / 2) - 2;
    const up = Math.floor(userRange / 2) + 2;
    for (let j = 0; j < pair.data.length - userRange; j++) {
      const stockIndex = pair.data;
      const firstDay = stockIndex[j];
      const lastDay = stockIndex[j + userRange - 1];
      let lowCount = 0;
      let upCount = 0;

      let check = true;

      // Confirm that the middle value does not higher than the two ends
      const checkGraphArr = [firstDay];
      for (let u = 1; u < userRange; u++) {
        if (
          firstDay.close < stockIndex[j + u].close ||
          lastDay.close < stockIndex[j + u].close
        ) {
          check = false;
          break;
        } else {
          checkGraphArr.push(stockIndex[j + u]);
        }
      }
      checkGraphArr.push(lastDay);

      // munute adjustment
      for (let u = low; u < up; u++) {
        if (
          (firstDay.close * 5) / 6 < stockIndex[j + u].close ||
          (lastDay.close * 5) / 6 < stockIndex[j + u].close
        ) {
          check = false;
          break;
        }
      }

      if (check) {
        // check balance
        if (
          checkGraphArr[0].close / 2 < checkGraphArr[userRange - 1].close &&
          checkGraphArr[userRange - 1].close < checkGraphArr[0].close * 2
        ) {
          // find middle point and close;
          let minDay = checkGraphArr[0];
          let minPosition = 0;
          for (let k = 1; k < checkGraphArr.length; k++) {
            if (minDay.close > checkGraphArr[k].close) {
              minDay = checkGraphArr[k];
              minPosition = k;
            }
          }

          if (minPosition !== 0) {
            // check m=-1 more than 70% from 0 to middle point
            for (let p = 1; p < minPosition; p++) {
              if (
                firstDay.close > checkGraphArr[p].close &&
                checkGraphArr[p].trend_slope === -1 &&
                lastDay.close > checkGraphArr[p].close
              ) {
                lowCount += 1;
              }
            }
            // check m=1 more than 70% from middle point to last one
            for (let t = minPosition; t < checkGraphArr.length; t++) {
              if (
                minDay.close < checkGraphArr[t].close &&
                checkGraphArr[t].trend_slope === 1 &&
                lastDay.close >= checkGraphArr[t].close &&
                firstDay.close > checkGraphArr[t].close
              ) {
                upCount += 1;
              }
            }

            if (upCount / minPosition > 0.5 && lowCount / minPosition > 0.5) {
              const objLeft = new Object;
              objLeft.id = pair.id;
              objLeft.startDate = checkGraphArr[0].date;
              objLeft.startPrice = checkGraphArr[0].close;
              objLeft.endDate = minDay.date;
              objLeft.endPrice = minDay.close;
              graphPosition.push(objLeft);

              const objRight = new Object;
              objRight.id = pair.id;
              objRight.startDate = minDay.date;
              objRight.startPrice = minDay.close;
              objRight.endDate = checkGraphArr[userRange - 1].date;
              objRight.endPrice = checkGraphArr[userRange - 1].close;
              graphPosition.push(objRight);
            }
          }
        }
      }
    }
  });
  return filterPricePair(graphPosition);
}

function noGraph(userSearch, stockPricePair) {
  const graphPosition = stockPricePair;
  // drop no match stock
  const finalStockPricePair = [];
  graphPosition.forEach((position)=>{
    const item = finalStockPricePair.find(
      (item) => item.id === position.id
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
        id: position.id,
        trend: [
          {
            startDate: 0,
            startPrice: 0,
            endDate: 0,
            endPrice: 0,
          },
        ],
      };
      if (Number(position.id) < 2833 && finalStockPricePair.length < 51) {
        finalStockPricePair.push(index);
      }
    }
  });
  return finalStockPricePair;
}

const stock = async (req, res, next) => {
  const userSearch = {
    stockCode: req.query.code,
    startDate: req.query.start,
    endDate: req.query.end,
  };

  const startString = moment(userSearch.startDate)
    .subtract(50, 'day')
    .format('YYYYMMDD');
  const endString = moment(userSearch.endDate).format('YYYYMMDD');
  userSearch.startDate = Number(startString);
  userSearch.endDate = Number(endString);
  const historyPrice = await Product.stock(userSearch);
  if (historyPrice.length !== 0) {
    const data = historyPrice.map((item)=>{
      const obj = new Object;
      obj.date = item.date; // date
      obj.code = item.code; // code
      obj.name = item.name; // name
      obj.open = item.open; // open
      obj.high = item.high; // high
      obj.low = item.low; // low
      obj.close = item.close; // close
      if (item.close - item.open >= 0) {
        obj.change = item.changes; // changes
      } else {
        obj.change = '-' + String(item.changes); // changes
      }
      obj.percentChange = String(
        (
          ((item.close - item.open) /
            item.open) *
          100
        ).toFixed(2)
      ); // changes %
      const volumeSql = item.volume.split(',');
      let volumeNum = '';
      volumeSql.forEach((item)=>{
        volumeNum += item;
      });
      obj.volume = Number(volumeNum); // volumn
      return obj;
    });
    res.send({ data: data });
  } else {
    res
      .status(400)
      .send({ error: 'Cannot find stock or Error stock code/name' });
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
  const stockPricePair = new Array; // id-[price] pair
  filterInit.forEach((init)=>{
    const item = stockPricePair.find(
      (item) => item.id === init.stock_id
    );
    if (item) {
      item['data'].push({
        date: init.date,
        open: init.open,
        close: init.close,
        changes: init.changes,
        trend_slope: init.trend_slope,
      });
    } else {
      const index = {
        id: init.stock_id,
        data: [
          {
            date: init.date,
            open: init.open,
            close: init.close,
            changes: init.changes,
            trend_slope: init.trend_slope,
          },
        ],
      };
      stockPricePair.push(index);
    }
  });

  // define graph
  let finalStockPricePair;
  switch (userSearch.graph) {
    case 'na':
      finalStockPricePair = noGraph(userSearch, stockPricePair);
      break;
    case 'reverseV':
      finalStockPricePair = reverseV(userSearch, stockPricePair);
      break;
    case 'uptrend':
      finalStockPricePair = uptrend(userSearch, stockPricePair);
      break;
    case 'downtrend':
      finalStockPricePair = downtrend(userSearch, stockPricePair);
      break;
    case 'test':
      finalStockPricePair = test(userSearch, stockPricePair);
      break;
  }
  // final stock
  const filterCode = new Array;
  const result = new Object;
  result.data = new Array;
  let obj = new Object;
  let priceObj = new Object;
  const idArr = finalStockPricePair.map((item) => {
    return item.id.toString();
  });
  const searchCode = [idArr, userSearch.start, userSearch.end];
  const stockInf = await Product.filter(searchCode);
  for (let g = 0; g < stockInf.length; g++) {
    const currentId = stockInf[g].code;
    const nextId = stockInf[g + 1] ? stockInf[g + 1].code : "";
    if (!obj.id) {
      obj.id = currentId;
      obj.price = new Array;
    }
    priceObj.date = stockInf[g].date; // date
    priceObj.code = stockInf[g].code; // code
    priceObj.name = stockInf[g].name; // name
    priceObj.open = stockInf[g].open; // open
    priceObj.high = stockInf[g].high; // high
    priceObj.low = stockInf[g].low; // low
    priceObj.close = stockInf[g].close; // close
    if (stockInf[g].close - stockInf[g].open >= 0) {
      priceObj.change = stockInf[g].changes; // changes
    } else {
      priceObj.change = "-" + String(stockInf[g].changes); // changes
    }
    priceObj.percentChange = String(
      (((stockInf[g].close - stockInf[g].open) / stockInf[g].open) * 100).toFixed(2)
    ); // changes %
    const volumeSql = stockInf[g].volume.split(",");
    let volumeNum = '';
    volumeSql.forEach((item) => {
      volumeNum += item;
    });
    priceObj.volume = Number(volumeNum); // volumn
    priceObj.pe = stockInf[g].pe;
    priceObj.fd = stockInf[g].fi_count;
    priceObj.sitc = stockInf[g].sitc_count;
    priceObj.dealers = stockInf[g].dealers_count;
    priceObj.total = stockInf[g].total;
    priceObj.industry = stockInf[g].industry;
    obj.price.push(priceObj);
    priceObj = new Object();
    if (nextId !== currentId) {
      result.data.push({
        id: obj.id,
        data: obj.price,
      });
      obj = new Object();
      if (stockInf[g] !== undefined) {
        filterCode.push({
          stock_code: stockInf[g].code,
          stock_id: stockInf[g].stock_id,
        });
      }
    }
  }
  for (let i = 0; i < finalStockPricePair.length; i++) {
    for (let j = 0; j < filterCode.length; j++) {
      if (finalStockPricePair[i].id === filterCode[j].stock_id) {
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
  const data = new Array;
  for (let i = 0; i < req.body.length; i++) {
    const stockData = req.body[i].data;
    //search history price
    const caseInf = new Array;
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
    const discount = parseInt(stockData.discount) / 100;
    const buyCostPercent = 0.001425;
    const sellCostPercent = 0.003;

    let stock = 0;
    let tradeCost = 0;
    const history = new Array;

    caseResult.forEach((caseRes)=>{
      const list = new Object;
      if (caseRes.changes >= increase) {
        if (increaseAct === 'buy' && property > caseRes.close) {
          // handling fee for buy
          const buyCost =
            caseRes.close * increaseCount * buyCostPercent * discount;
          list.profitPercent = (
            property +
            stock * caseRes.close -
            buyCost -
            propertyInit
          ).toFixed(2);
          // trade cost
          tradeCost += buyCost;
          // stock count
          stock += increaseCount;
          // property
          property = property - buyCost - caseRes.close * increaseCount;
          list.information = caseRes.date;
          list.situation = increaseAct;
          list.price = caseRes.close;
          list.stock = stock;
          list.value = caseRes.close;
          list.tradeCost = Number(buyCost.toFixed(2));
          list.property = Number(
            (property + caseRes.close * stock).toFixed(2)
          );
          history.push(list);
        } else if (increaseAct === 'sell' && stock > 0) {
          // handling fee for sell
          const sellCost =
            caseRes.close * increaseCount * buyCostPercent * discount +
            caseRes.close * increaseCount * sellCostPercent;

          list.profitPercent = (
            property +
            stock * caseRes.close -
            sellCost -
            propertyInit
          ).toFixed(2);

          // trade cost
          tradeCost += sellCost;
          // stock count
          stock -= increaseCount;

          // property
          property = property - sellCost + caseRes.close * increaseCount;

          list.information = caseRes.date;
          list.situation = increaseAct;
          list.price = caseRes.close;
          list.stock = stock;
          list.value = caseRes.close;
          list.tradeCost = Number(sellCost.toFixed(2));
          list.property = Number(
            (property + caseRes.close * stock).toFixed(2)
          );
          history.push(list);
        }
      } else if (caseRes.changes <= decrease) {
        if (decreaseAct === 'buy' && property > caseRes.close) {
          // handling fee for buy
          const buyCost =
            caseRes.close * decreaseCount * buyCostPercent * discount;
          list.profitPercent = (
            property +
            stock * caseRes.close -
            buyCost -
            propertyInit
          ).toFixed(2);
          // trade cost
          tradeCost += buyCost;
          // stock count
          stock += decreaseCount;

          // property
          property = property - buyCost - caseRes.close * decreaseCount;

          list.information = caseRes.date;
          list.situation = decreaseAct;
          list.price = caseRes.close;
          list.stock = stock;
          list.value = caseRes.close;
          list.tradeCost = Number(buyCost.toFixed(2));
          list.property = Number(
            (property + caseRes.close * stock).toFixed(2)
          );
          history.push(list);
        } else if (decreaseAct === 'sell' && stock > 0) {
          const list = new Object;
          // handling fee for sell
          const sellCost =
            caseRes.close * decreaseCount * buyCostPercent * discount +
            caseRes.close * decreaseCount * sellCostPercent;

          list.profitPercent = (
            property +
            stock * caseRes.close -
            sellCost -
            propertyInit
          ).toFixed(2);

          // trade cost
          tradeCost += sellCost;
          // stock count
          stock -= decreaseCount;

          // property
          property = property - sellCost + caseRes.close * decreaseCount;

          list.information = caseRes.date;
          list.situation = decreaseAct;
          list.price = caseRes.close;
          list.stock = stock;
          list.value = caseRes.close;
          list.tradeCost = Number(sellCost.toFixed(2));
          list.property = Number(
            (property + caseRes.close * stock).toFixed(2)
          );
          history.push(list);
        }
      }
    });
    if (history.length === 0) {
      res.status(400).send({ error: '無任何交易產生，請重新選擇條件' });
    }
    const len = caseResult.length;
    const caseData = {
      case: stockData,
      summary: {
        finalStock: stock,
        stockValue: caseResult[len - 1].close,
        totalAssets: Number(
          (property + stock * caseResult[len - 1].close).toFixed(2)
        ),
        tradeCost: Number(tradeCost.toFixed(2)),
        earningRate: Number(
          (
            ((property +
              stock * caseResult[len - 1].close -
              parseInt(stockData.property)) /
              parseInt(stockData.property)) *
            100
          ).toFixed(2)
        ),
        income: Number(
          (
            property +
            stock * caseResult[len - 1].close -
            parseInt(stockData.property)
          ).toFixed(2)
        ),
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
