const Product = require("../models/stock_model");
const moment = require("moment"); // calculate time
const { normalizeUnits } = require("moment");

function dateCheck(start, end) {
  console.log("start",start)
  console.log("end",end)
  return new Promise((resolve, reject) => {
    console.log("OK")
    // 日期都沒填寫
    // if (start === '' && end === '') {
    //   console.log('all no')
    //   let today = moment().format("YYYY/MM/DD"); //string
    //   let endString = today.split('/')[0] + today.split('/')[1] + today.split('/')[2]
    //   const startCount = moment([endString]).subtract(180, "days").format("YYYYMMDD");
    //   let result = {
    //     start: parseInt(today),
    //     end: parseInt(startCount),
    //   }
    //   resolve(result);
    //   return;
    //   // 只填寫 end date
    // } else if (start === '' && end !== '') {
    //   console.log('end')
    //   const endString = end.split('-')
    //   let endcount = endString[0] + '/' + endString[1] + '/' + endString[2]
    //   const startCount = moment([endcount]).subtract(180, "days").format("YYYYMMDD");
    //   let endTime = endString[0] + endString[1] + endString[2]
    //   let result = {
    //     start: parseInt(startCount),
    //     end: parseInt(endTime),
    //   }
    //   resolve(result);
    //   return;

    //   // 只填寫 start date
    // } else if (start !== '' && end === '') {
    //   console.log('start')
    //   const startString = start.split('-')
    //   const startTime = startString[0] + startString[1] + startString[2]
    //   const endString = moment().format("YYYYMMDD"); //string
    //   let result = {
    //     start: parseInt(startTime),
    //     end: Number(endString),
    //   }
    //   resolve(result);
    //   return;

    // } else {
      console.log('all ok')
      const startString = start.split('-')
      const startTime = startString[0] + startString[1] + startString[2]
      const endString = end.split('-')
      const endTime = endString[0] + endString[1] + endString[2]
      let result = {
        start: parseInt(startTime),
        end: parseInt(endTime),
      }
      resolve(result);
      return;
    // }
  })
}

// function test(userSearch, stockPricePair) {
//   console.log('graph test')


//   // graph V
//   // 找到圖形符合之型態
//   // 對全部股票進行掃描
//   // 對單一股票的歷史價格進行掃描
//   // 30 day    3 day
//   // 180 day    6 day
//   // 360 day    9 day
//   // 找出最小值的位置與close
//   // 從第0個到最低點是否close是否都小於第0個且m=-1佔7成
//   // 從最低點到最後一個是否close是否都大於最低點且m=1佔7成
//   // 將0、最低點、最後一個的start與end打包成index塞入array
//   // 整理array

//   // 找到圖形符合之型態
//   let graphPosition = [];
//   // 對全部股票進行掃描
//   for (let i = 0; i < stockPricePair.length; i++) {
//     // console.log(stockPricePair.length)
//     console.log('i', i)
//     // 對單一股票的歷史價格進行掃描
//     let r = 25;
//     let low = (Math.floor(r / 2)) - 2
//     let up = (Math.floor(r / 2)) + 2
//     for (let j = 0; j < stockPricePair[i].data.length - r; j++) {
//       // console.log(stockPricePair[i].data.length)

//       // for (let j = 0; j < 60; j++) {
//       // console.log("j",j)
//       let stockIndex = stockPricePair[i].data;
//       let firstDay = stockIndex[j]
//       let lastDay = stockIndex[j + r - 1]
//       let lowCount = 0;
//       let upCount = 0;

//       let check = true;

//       for (let u = 1; u < r - 1; u++) {
//         if (firstDay.close < stockIndex[j + u].close || lastDay.close < stockIndex[j + u].close) {
//           check = false;
//           break;
//         }
//       }

//       for (let u = low; u < up; u++) {
//         if ((firstDay.close * 5) / 6 < stockIndex[j + u].close || ((lastDay.close) * 5) / 6 < stockIndex[j + u].close) {
//           check = false;
//           break;
//         }
//       }

//       if (check === true) {
//         // 確認左右平衡點
//         if ((firstDay.close * 0.1) < lastDay.close && lastDay.close < (firstDay.close * 2)) {
//           // console.log('AAAAAAAAAA')
//           // console.log("j", j)
//           // 找出中間的位置與close;
//           let minDay = firstDay
//           let minPosition = 0;
//           let stockIndexLength = (stockPricePair[i].data.length - j) > (r - 1) ? r : stockPricePair[i].data.length - j
//           for (k = 1; k < stockIndexLength; k++) {
//             // console.log(stockIndex[j + k].close)
//             if (minDay.close > stockIndex[j + k].close) {
//               minDay = stockIndex[j + k];
//               minPosition = k;
//             }
//           }
//           // console.log("0",firstDay)
//           // console.log("1",minDay)
//           // console.log("2", lastDay)
//           // console.log("/////////////////")
//           if (minPosition !== 0) {
//             // console.log('CCCCCCCCCC')
//             // 從第0個到最低點是否close是否都小於第0個且m=-1佔7成
//             for (k = 1; k < minPosition; k++) {
//               if (firstDay.close > stockIndex[k].close && stockIndex[k].m === -1 && lastDay.close > stockIndex[k].close) {
//                 lowCount += 1;
//               }
//             }
//             // 從最低點到最後一個是否close是否都大於最低點且m=1佔7成
//             for (k = minPosition; k < stockIndexLength; k++) {
//               if (minDay.close < stockIndex[k].close && stockIndex[k].m === 1 && lastDay.close >= stockIndex[k].close && firstDay.close > stockIndex[k].close) {
//                 upCount += 1;
//               }
//             }

//             // console.log(6)
//             if ((upCount / minPosition) > 0.7 && (lowCount / minPosition) > 0.7) {
//               // console.log('DDDDDDDD')
//               let index = {};
//               index.id = stockPricePair[i].id;
//               // console.log(stockPricePair[i].id)
//               index.startDate = firstDay.date;
//               index.startPrice = firstDay.close;
//               index.endDate = minDay.date;
//               index.endPrice = minDay.close;

//               graphPosition.push(index);
//               // console.log(index)
//               // console.log(graphPosition)
//               // console.log('EEEEE')
//               let indexs = { id: stockPricePair[i].id };
//               indexs.startDate = minDay.date;
//               indexs.startPrice = minDay.close;
//               indexs.endDate = lastDay.date;
//               indexs.endPrice = lastDay.close;
//               // console.log('FFF')
//               graphPosition.push(indexs);
//               // console.log('GGGGG')
//               // console.log("j",j)
//               // console.log("leng", stockPricePair[i].data.length)
//               // if (j < stockPricePair[i].data.length - r - 1){
//               //   console.log('HHHHHHHH')
//               j = j + r;
//               //   console.log('IIIIII')
//               // } else {
//               //   j = stockPricePair[i].data.length - r -1
//               // }
//             }
//           }
//         }


//       }


//       // }
//       // } 
//     }
//   }
//   // console.log(graphPosition);
//   // console.log(graphPosition[1].startDate);
//   // return;

//   // console.log(graphPosition);
//   console.log("D")
//   // 剔除不符合條件的 stock
//   let finalStockPricePair = [];
//   for (let i = 0; i < graphPosition.length; i++) {
//     let item = finalStockPricePair.find(item => item.id === graphPosition[i].id);
//     if (item) {
//       item["trend"].push(
//         {
//           startDate: graphPosition[i].startDate,
//           startPrice: graphPosition[i].startPrice,
//           endDate: graphPosition[i].endDate,
//           endPrice: graphPosition[i].endPrice,
//         }
//       );
//     } else {
//       let index = {
//         id: graphPosition[i].id,
//         trend: [
//           {
//             startDate: graphPosition[i].startDate,
//             startPrice: graphPosition[i].startPrice,
//             endDate: graphPosition[i].endDate,
//             endPrice: graphPosition[i].endPrice,
//           }
//         ],
//       }
//       // console.log(index)
//       finalStockPricePair.push(index);
//     }
//   }
//   // console.log(finalStockPricePair)
//   console.log("OK")
//   return finalStockPricePair;
// }

function island(userSearch, stockPricePair) {
  console.log('graph test')

  // 找到圖形符合之型態
  let graphPosition = [];
  // 對全部股票進行掃描
  for (let i = 0; i < stockPricePair.length; i++) {
    // console.log(stockPricePair.length)
    console.log('i', i)
    // 對單一股票的歷史價格進行掃描
    let r = 20;
    let c = 4;
    for (let j = 0; j < stockPricePair[i].data.length - r-1; j++) {

      let stockIndex = stockPricePair[i].data;
      let firstDay = stockIndex[j]
      let firstEndDay = stockIndex[j + c - 1]
      let lastDay = stockIndex[j + r - c]
      let lastEndDay = stockIndex[j + r - 1]

      let check = true;

      for (let u = 1; u < c-1; u++) {
        if (firstDay.close > stockIndex[j + u].close || stockIndex[j + u -1].close > stockIndex[j + u].close) {
          check = false;
          break;
        }
      }

      for (let u = r-c; u < r; u++) {
        if (lastDay.close < stockIndex[j + u].close || stockIndex[j + u + 1].close > stockIndex[j + u].close) {
          check = false;
          break;
        }
      }

      for (let u = c ; u < r - c; u++) {
        if (lastDay.close > stockIndex[j + u].close || firstEndDay.close > stockIndex[j + u].close) {
          check = false;
          break;
        }
      }

      if (check === true) {

        let index = {};
        index.id = stockPricePair[i].id;
        index.startDate = firstDay.date;
        index.startPrice = firstDay.close;
        index.endDate = firstEndDay.date;
        index.endPrice = firstEndDay.close;

        graphPosition.push(index);

        let indexs = { id: stockPricePair[i].id };
        indexs.startDate = firstEndDay.date;
        indexs.startPrice = firstEndDay.close;
        indexs.endDate = lastDay.date;
        indexs.endPrice = lastDay.close;

        graphPosition.push(indexs);

        let indexss = { id: stockPricePair[i].id };
        indexss.startDate = lastDay.date;
        indexss.startPrice = lastDay.close;
        indexss.endDate = lastEndDay.date;
        indexss.endPrice = lastEndDay.close;

        graphPosition.push(indexss);

        j = j + r;


      }
    }
  }
  // console.log(graphPosition);
  // console.log(graphPosition[1].startDate);
  // return;

  // console.log(graphPosition);
  console.log("D")
  // 剔除不符合條件的 stock
  let finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    let item = finalStockPricePair.find(item => item.id === graphPosition[i].id);
    if (item) {
      item["trend"].push(
        {
          startDate: graphPosition[i].startDate,
          startPrice: graphPosition[i].startPrice,
          endDate: graphPosition[i].endDate,
          endPrice: graphPosition[i].endPrice,
        }
      );
    } else {
      let index = {
        id: graphPosition[i].id,
        trend: [
          {
            startDate: graphPosition[i].startDate,
            startPrice: graphPosition[i].startPrice,
            endDate: graphPosition[i].endDate,
            endPrice: graphPosition[i].endPrice,
          }
        ],
      }
      // console.log(index)
      finalStockPricePair.push(index);
    }
  }
  console.log(finalStockPricePair)
  console.log("OK")
  return finalStockPricePair;
}

function uptrend(userSearch, stockPricePair) {

  // 找到圖形符合之型態
  let graphPosition = [];
  // 對全部股票進行掃描
  for (let i = 0; i < stockPricePair.length; i++) {
    console.log("i", i);
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
        for (k = 1; k < stockIndexLength; k++) {
          if (
            firstDay.close < stockIndex[k].close &&
            stockIndex[k].m === 1 &&
            stockIndex[k - 1].close <= stockIndex[k].close
          ) {
            upCount += 1;
          }
        }

        // console.log(6)
        if (upCount / r > 0.7) {
          // console.log('DDDDDDDD')
          let index = {};
          index.id = stockPricePair[i].id;
          // console.log(stockPricePair[i].id)
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
  // console.log(graphPosition);
  // console.log(graphPosition[1].startDate);
  // return;

  // console.log(graphPosition);
  console.log("D");
  // 剔除不符合條件的 stock
  let finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    let item = finalStockPricePair.find(
      (item) => item.id === graphPosition[i].id
    );
    if (item) {
      item["trend"].push({
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
      // console.log(index)
      finalStockPricePair.push(index);
    }
  }
  // console.log(finalStockPricePair)
  console.log("OK");
  return finalStockPricePair;
}

function downtrend(userSearch, stockPricePair) {
  // 找到圖形符合之型態
  let graphPosition = [];
  // 對全部股票進行掃描
  for (let i = 0; i < stockPricePair.length; i++) {
    console.log("i", i);
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
        for (k = 1; k < stockIndexLength; k++) {
          if (
            firstDay.close < stockIndex[k].close &&
            stockIndex[k].m === -1 &&
            stockIndex[k - 1].close >= stockIndex[k].close
          ) {
            upCount += 1;
          }
        }

        // console.log(6)
        if (upCount / r > 0.5) {
          // console.log('DDDDDDDD')
          let index = {};
          index.id = stockPricePair[i].id;
          // console.log(stockPricePair[i].id)
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
  // console.log(graphPosition);
  // console.log(graphPosition[1].startDate);
  // return;

  // console.log(graphPosition);
  console.log("D");
  // 剔除不符合條件的 stock
  let finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    let item = finalStockPricePair.find(
      (item) => item.id === graphPosition[i].id
    );
    if (item) {
      item["trend"].push({
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
      // console.log(index)
      finalStockPricePair.push(index);
    }
  }
  // console.log(finalStockPricePair)
  console.log("OK");
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
    // console.log(stockPricePair.length)
    console.log("i", i);
    // 對單一股票的歷史價格進行掃描
    console.log(userSearch)
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
          for (k = 1; k < stockIndexLength; k++) {
            // console.log(stockIndex[j + k].close)
            if (minDay.close > stockIndex[j + k].close) {
              minDay = stockIndex[j + k];
              minPosition = k;
            }
          }

          if (minPosition !== 0) {
            // 從第0個到最低點是否close是否都小於第0個且m=-1佔7成
            for (k = 1; k < minPosition; k++) {
              if (
                firstDay.close > stockIndex[k].close &&
                stockIndex[k].m === -1 &&
                lastDay.close > stockIndex[k].close
              ) {
                lowCount += 1;
              }
            }
            // 從最低點到最後一個是否close是否都大於最低點且m=1佔7成
            for (k = minPosition; k < stockIndexLength; k++) {
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
      item["trend"].push({
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
      // console.log(index)
      finalStockPricePair.push(index);
    }
  }
  // console.log(finalStockPricePair)
  console.log("OK");
  return finalStockPricePair;
}

function na(userSearch, stockPricePair) {

  let graphPosition = stockPricePair;

  // 剔除不符合條件的 stock
  let finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    let item = finalStockPricePair.find(
      (item) => item.id === graphPosition[i].id
    );
    if (item) {
      item["trend"].push({
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
      // console.log(index)
      finalStockPricePair.push(index);
    }
  }
  console.log(finalStockPricePair)
  console.log("OK");
  return finalStockPricePair;
}

function multiV(userSearch, stockPricePair) {
  console.log('graph test')
  // 抓折返點
  let userArr = [-1, 1];

  // 進行 array 判斷
  let graphPosition = [];
  for (let i = 0; i < stockPricePair.length; i++) {
    for (let j = 15; j < stockPricePair[i].data.length - 15; j++) {

      let stockIndex = stockPricePair[i].data;

      if (stockIndex[j].m === userArr[0] && stockIndex[j + 1].m === userArr[1]) {
        let index = { id: stockPricePair[i].id };
        // 確認左邊是否為負，找到不等於-1為止
        for (let k=0; k<15; k++) {
          if (stockIndex[j - k].m !== undefined && stockIndex[j - k].m !== -1) {
            console.log("start one")
            index.startDate = stockIndex[j - k].date;
            index.startPrice = stockIndex[j - k].close;
            index.endDate = stockIndex[j].date;
            index.endPrice = stockIndex[j].close;
            graphPosition.push(index)
            break;
          }
        }
        let indexs = { id: stockPricePair[i].id };
        // 確認右邊邊是否為正，找到不等於+1為止
        for (let k = 1; k < 15; k++) {
          if (stockIndex[j + k ].m === undefined || stockIndex[j + k].m !== 1) {
            console.log("end one")
            indexs.startDate = stockIndex[j].date;
            indexs.startPrice = stockIndex[j].close;
            indexs.endDate = stockIndex[j + k].date;
            indexs.endPrice = stockIndex[j + k].close;
            graphPosition.push(indexs)
            break;
          // } else if (stockIndex[j + k].m === undefined && stockIndex[j + k - 1].m === 1) {
          //   console.log("last one")
          //   index.startDate = stockIndex[j].date;
          //   index.startPrice = stockIndex[j].close;
          //   index.endDate = stockIndex[j + k].date;
          //   index.endPrice = stockIndex[j + k].close;
          //   graphPosition.push(index)
          //   break;
          }
        }
      }
    }
  }
  console.log(graphPosition);
  // console.log(graphPosition[1].startDate);
  // return;

  // console.log(stockPricePair[0].id);
  console.log("D")
  // 剔除不符合條件的 stock
  let finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    let item = finalStockPricePair.find(item => item.id === graphPosition[i].id);
    if (item) {
      item["trend"].push(
        {
          startDate: graphPosition[i].startDate,
          startPrice: graphPosition[i].startPrice,
          endDate: graphPosition[i].endDate,
          endPrice: graphPosition[i].endPrice,
        }
      );
    } else {
      let index = {
        id: graphPosition[i].id,
        trend: [
          {
            startDate: graphPosition[i].startDate,
            startPrice: graphPosition[i].startPrice,
            endDate: graphPosition[i].endDate,
            endPrice: graphPosition[i].endPrice,
          }
        ],
      }
      // console.log(index)
      finalStockPricePair.push(index);
    }
  }
  // console.log(finalStockPricePair)

  return finalStockPricePair;
}

function graphV(userSearch, stockPricePair) {
  // 將 user 需求創成 array
  let userArr = [];

  for (let i = 0; i < userSearch.downDay; i++) {
    userArr.push(-1)
  }

  for (let i = 0; i < userSearch.upDay; i++) {
    userArr.push(+1)
  }

  // 進行 array 判斷
  console.log("C")
  let graphPosition = [];
  for (let i = 0; i < stockPricePair.length; i++) {
    for (let j = 0; j < (stockPricePair[i].data.length) - 5; j++) {
      let stockIndex = stockPricePair[i].data;
      // if (stockIndex[j].m === userArr[0] && stockIndex[j + 1].m === userArr[1] && stockIndex[j + 2].m === userArr[2] && stockIndex[j + 3].m === userArr[3] && stockIndex[j + 4].m === userArr[4] && stockIndex[j + 5].m === userArr[5]) {

      // flag = true
      // for(...){
      //   ...if ...
      //     flag = false
      // }
      // for(...) {
      //   if ...
      //     flag = false
      // }

      // if (flag){
      //   do something
      // }

      if (stockIndex[j].m === userArr[0] && stockIndex[j + 1].m === userArr[1] && stockIndex[j + 2].m === userArr[2] && stockIndex[j + 3].m === userArr[3] && stockIndex[j + 4].m === userArr[4] && stockIndex[j + 5].m === userArr[5] && stockIndex[j + 6].m === userArr[6] && stockIndex[j + 7].m === userArr[7] && stockIndex[j + 8].m === userArr[8] && stockIndex[j + 9].m === userArr[9]) {
        let index = {
          id: stockPricePair[i].id,
          data:
          {
            startDate: stockIndex[j].date,
            startPrice: stockIndex[j].close,
            midDate: stockIndex[j + 3].date,
            midPrice: stockIndex[j + 3].close,
            endDate: stockIndex[j + 5].date,
            endPrice: stockIndex[j + 5].close,
          },
          trendLine: [
            {
              startDate: stockIndex[j].date,
              startValue: stockIndex[j].close,
              endDate: stockIndex[j + 3].date,
              endValue: stockIndex[j + 3].close,
            },
            {
              startDate: stockIndex[j + 3].date,
              startValue: stockIndex[j + 3].close,
              endDate: stockIndex[j + 5].date,
              endValue: stockIndex[j + 5].close,
            }
          ]
        };
        graphPosition.push(index)
      }
    }
  }
  // console.log(graphPosition);

  // console.log(stockPricePair[0].id);
  console.log("D")
  // 剔除不符合條件的 stock
  let finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    let item = finalStockPricePair.find(item => item.id === graphPosition[i].id);
    if (item) {
      item["trend"].push(
        graphPosition[i].trendLine
      );
    } else {
      let index = {
        id: graphPosition[i].id,
        trend: [
          graphPosition[i].trendLine
        ],
      }
      finalStockPricePair.push(index);
    }
  }
  return finalStockPricePair;
}

const singleStock = async (req, res, next) => {
  let userSearch = {
    stockCode: req.body.stockCode,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };
  
  const startString = (moment(userSearch.startDate).subtract(50,"day").format("YYYYMMDD"));
  const endString = (moment(userSearch.endDate).format("YYYYMMDD"));
  userSearch.startDate = Number(startString);
  userSearch.endDate = Number(endString);
  let historyPrice = await Product.singleStock(userSearch);
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

      let volumeSql = (historyPrice[i].volume).split(',');
      let volumeNum = '';
      for (let i = 0; i < volumeSql.length; i++){
        volumeNum += volumeSql[i]
      }
      index.volume = Number(volumeNum); // volumn
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
    res.status(400).send({ error: "Cannot find stock or Error stock code/name" });
  }
};

const option = async (req, res, next) => {
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

const option2 = async (req, res, next) => {

  // 對 "價格區間" 與 "日期" 對 DB 進行篩選

  // 對 "rank" 進行篩選
  // 對 "10日新高" 進行篩選
  // 進行 "圖形判斷"，取需要的值(顧客需求的天數與 % 數)，進行 array- object 排列
  // "黃金交叉" 進行統計

  let userSearch = {
    start: req.body.start,
    end: req.body.end,
    upper: req.body.upper,
    lower: req.body.lower,
    graph: req.body.graph,
    count: req.body.count,
    increase: req.body.increase,
    decrease: req.body.decrease,
  }

  // -------------------------------------------------------------

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
      item["data"].push(
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
      }
      stockPricePair.push(index);
    }
  }

  // 進行圖形分類判斷

  let finalStockPricePair;

  if (userSearch.graph === "na") {
    finalStockPricePair = na(userSearch, stockPricePair);
  } else if (userSearch.graph === "reverseV") {
    finalStockPricePair = reverseV(userSearch, stockPricePair);
  } else if (userSearch.graph === "uptrend") {
    finalStockPricePair = uptrend(userSearch, stockPricePair);
  } else if (userSearch.graph === "downtrend") {
    finalStockPricePair = downtrend(userSearch, stockPricePair);
  } else if (userSearch.graph === "test") {
    finalStockPricePair = test(userSearch, stockPricePair);
  } else {
    finalStockPricePair = stockPricePair;
  }

  console.log(finalStockPricePair)
  // 找最終符合條件的 stock 回傳
  let filterCode = []
  let result = {};
  result.data = [];
  for (let i = 0; i < finalStockPricePair.length; i++) {
    let searchCode = {
      id: finalStockPricePair[i].id,
      start: userSearch.start,
      end: userSearch.end,
    }
    let stockInf = await Product.filter(searchCode);
    if (stockInf.length !== 0) {
      let price = [];
      for (let i = 0; i < stockInf.length; i++) {

        let index = {};
        index.date = stockInf[i].date; // date
        index.code = stockInf[i].code; // code
        // console.log("sorting");
        // console.log(index)
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
      })
    } else {
      console.log("找不到");
    }
  }

  for (let i = 0; i < finalStockPricePair.length; i++) {
    for (let j = 0; j < filterCode.length; j++) {
      if (finalStockPricePair[i].id === filterCode[j].stock_id){
        finalStockPricePair[i].id = filterCode[j].stock_code;
      }
    }
  }
  // console.log(finalStockPricePair)

  for (let i = 0; i < result.data.length; i++) {
    for (let j = 0; j < finalStockPricePair.length; j++) {
      if (result.data[i].id === finalStockPricePair[j].id) {
        result.data[i]["trend"] = finalStockPricePair[j]["trend"];
      }
    }
  }


  result.inf = userSearch;
  console.log(result)

  res.send(result)
};

const option2island = async (req, res, next) => {

  // 對 "價格區間" 與 "日期" 對 DB 進行篩選

  // 對 "rank" 進行篩選
  // 對 "10日新高" 進行篩選
  // 進行 "圖形判斷"，取需要的值(顧客需求的天數與 % 數)，進行 array- object 排列
  // "黃金交叉" 進行統計

  let userSearch = {
    start: req.body.start,
    end: req.body.end,
    upper: req.body.upper,
    lower: req.body.lower,
    graph: req.body.graph,
    count: req.body.count,
    upDay: req.body.upDay,
    downDay: req.body.downDay,
    increase: req.body.increase,
    decrease: req.body.decrease,
    rank: req.body.rank,
    High: req.body.High,
    cross: req.body.cross,
    consolidate: req.body.consolidate,
    cycle: req.body.cycle,
    continuousRed: req.body.continuousRed,
  }

  // -------------------------------------------------------------

  // 對 "價格區間" 與 "日期" 對 DB 進行篩選

  let date = await dateCheck(userSearch.start, userSearch.end);
  userSearch.start = date.start;
  userSearch.end = date.end;

  let filterInit = await Product.filterInit(userSearch);

  // 進行 "圖形判斷"，取需要的值(顧客需求的天數與 % 數)，進行 array- object 排列


  // 先將資料預處理 id-[price] pair
  console.log("A")
  let stockPricePair = []; // id-[price] pair

  for (let i = 0; i < filterInit.length; i++) {
    let item = stockPricePair.find(item => item.id === filterInit[i].stock_id);
    if (item) {
      item["data"].push(
        {
          date: filterInit[i].date,
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
            close: filterInit[i].close,
            changes: filterInit[i].changes,
            m: filterInit[i].m,
          }
        ],
      }
      stockPricePair.push(index);
    }
  }
  // console.log(stockPricePair)
  // console.log(stockPricePair.length);

  console.log("B")
  // 將 user 需求創成 array
  let userArr = [];

  for (let i = 0; i < userSearch.downDay; i++) {
    userArr.push(-1)
  }

  for (let i = 0; i < userSearch.upDay; i++) {
    userArr.push(+1)
  }
  // console.log(userArr)

  // 進行 array 判斷
  console.log("C")
  let graphPosition = [];
  for (let i = 0; i < stockPricePair.length; i++) {
    for (let j = 0; j < (stockPricePair[i].data.length) - 5; j++) {
      let stockIndex = stockPricePair[i].data;
      // if (stockIndex[j].m === userArr[0] && stockIndex[j + 1].m === userArr[1] && stockIndex[j + 2].m === userArr[2] && stockIndex[j + 3].m === userArr[3] && stockIndex[j + 4].m === userArr[4] && stockIndex[j + 5].m === userArr[5]) {

      // flag = true
      // for(...){
      //   ...if ...
      //     flag = false
      // }
      // for(...) {
      //   if ...
      //     flag = false
      // }

      // if (flag){
      //   do something
      // }

      if (stockIndex[j].m === userArr[0] && stockIndex[j + 1].m === userArr[1] && stockIndex[j + 2].m === userArr[2] && stockIndex[j + 3].m === userArr[3] && stockIndex[j + 4].m === userArr[4] && stockIndex[j + 5].m === userArr[5] && stockIndex[j + 6].m === userArr[6] && stockIndex[j + 7].m === userArr[7] && stockIndex[j + 8].m === userArr[8] && stockIndex[j + 9].m === userArr[9]) {
        let index = {
          id: stockPricePair[i].id,
          data:
          {
            startDate: stockIndex[j].date,
            startPrice: stockIndex[j].close,
            midDate: stockIndex[j + 3].date,
            midPrice: stockIndex[j + 3].close,
            endDate: stockIndex[j + 5].date,
            endPrice: stockIndex[j + 5].close,
          },
          trendLine: [
            {
              startDate: stockIndex[j].date,
              startValue: stockIndex[j].close,
              endDate: stockIndex[j + 3].date,
              endValue: stockIndex[j + 3].close,
            },
            {
              startDate: stockIndex[j + 3].date,
              startValue: stockIndex[j + 3].close,
              endDate: stockIndex[j + 5].date,
              endValue: stockIndex[j + 5].close,
            }
          ]
        };
        graphPosition.push(index)
      }
    }
  }
  // console.log(graphPosition);

  // console.log(stockPricePair[0].id);
  console.log("D")
  // 剔除不符合條件的 stock
  let finalStockPricePair = [];
  for (let i = 0; i < graphPosition.length; i++) {
    let item = finalStockPricePair.find(item => item.id === graphPosition[i].id);
    if (item) {
      item["trend"].push(
        graphPosition[i].trendLine
      );
    } else {
      let index = {
        id: graphPosition[i].id,
        trend: [
          graphPosition[i].trendLine
        ],
      }
      finalStockPricePair.push(index);
    }
  }
  // console.log(finalStockPricePair)


  // 找最終符合條件的 stock 回傳
  let filterCode = []
  let result = {};
  result.data = [];
  for (let i = 0; i < finalStockPricePair.length; i++) {
    console.log(finalStockPricePair)
    console.log("////////////////////////")
    let searchCode = {
      id: finalStockPricePair[i].id,
      start: userSearch.start,
      end: userSearch.end,
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
      })
    } else {
      console.log("找不到");
    }
  }

  // console.log(result.data[0])

  for (let i = 0; i < finalStockPricePair.length; i++) {
    for (let j = 0; j < filterCode.length; j++) {
      if (finalStockPricePair[i].id === filterCode[j].stock_id) {
        finalStockPricePair[i].id = filterCode[j].stock_code;
      }
    }
  }
  // console.log(finalStockPricePair)

  for (let i = 0; i < result.data.length; i++) {
    for (let j = 0; j < finalStockPricePair.length; j++) {
      if (result.data[i].id === finalStockPricePair[j].id) {
        result.data[i]["trend"] = finalStockPricePair[j]["trend"];
      }
    }
  }


  result.inf = userSearch;
  // console.log(result)

  res.send(result)
};


const backTest = async (req, res, next) => {

  let data = []
  for (let i = 0; i < req.body.length; i++) {

    let stockData = req.body[i].data;
    //找歷史資料
    let caseInf = [];
    caseInf.push(parseInt(stockData.code));
    caseInf.push(parseInt(stockData.startDate));
    caseInf.push(parseInt(stockData.endDate));
    console.log(caseInf)
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
      console.log("今日漲跌為: ",caseResult[i].changes)
      if (caseResult[i].changes >= increase) {
        if (increaseAct === "buy" && property > caseResult[i].close) {
          console.log("漲要買 ")
          console.log("資金為 ", property)
          let list = {};
          // console.log(0)
          // 購買手續費
          let buyCost = caseResult[i].close * increaseCount * buyCostPercent * discount;
          // console.log(1)
          list.profitPercent = (((property + (stock * caseResult[i].close)) - buyCost) - propertyInit).toFixed(2)
          // console.log(2)
          // 累積交易成本
          tradeCost += buyCost;
          // console.log(3)
          // 庫存stock數量
          stock += increaseCount;
          // console.log(4)
          // 總資產扣除
          property = property - buyCost - (caseResult[i].close * increaseCount)
          // console.log(5)
          list.information = caseResult[i].date;
          list.situation = increaseAct;
          list.price = caseResult[i].close
          list.stock = stock
          list.value = caseResult[i].close;
          list.tradeCost = Number((buyCost).toFixed(2))
          list.property = Number((property + (caseResult[i].close * stock)).toFixed(2))
          history.push(list)
        } else if (increaseAct === "sell" && stock > 0) {
          console.log("漲要賣 ")
          console.log("股票庫存為 ", property)
          let list = {};
          // 賣出手續費
          let sellCost = (caseResult[i].close * increaseCount * buyCostPercent * discount) + (caseResult[i].close * increaseCount * sellCostPercent);

          list.profitPercent = (((property + (stock * caseResult[i].close)) - sellCost) - propertyInit).toFixed(2)

          // 累積交易成本
          tradeCost += sellCost;
          // 庫存stock數量
          stock -= increaseCount;

          // 總資產扣除
          property = property - sellCost + (caseResult[i].close * increaseCount);

          list.information = caseResult[i].date;
          list.situation = increaseAct;
          list.price = caseResult[i].close
          list.stock = stock
          list.value = caseResult[i].close;
          list.tradeCost = Number((sellCost).toFixed(2))
          list.property = Number((property + (caseResult[i].close * stock)).toFixed(2));
          history.push(list)
        }

      } else if (caseResult[i].changes <= decrease) {
        if (decreaseAct === "buy" && property > caseResult[i].close) {
          console.log("跌要買 ")
          console.log("資金為 ", property)
          let list = {};
          // 購買手續費
          let buyCost = caseResult[i].close * decreaseCount * buyCostPercent * discount;
          list.profitPercent = (((property + (stock * caseResult[i].close)) - buyCost) - propertyInit).toFixed(2)
          // 累積交易成本
          tradeCost += buyCost;
          // 庫存stock數量
          stock += decreaseCount;

          // 總資產扣除
          property = property - buyCost - (caseResult[i].close * decreaseCount)

          list.information = caseResult[i].date;
          list.situation = decreaseAct;
          list.price = caseResult[i].close
          list.stock = stock
          list.value = caseResult[i].close;
          list.tradeCost = Number((buyCost).toFixed(2))
          list.property = Number((property + (caseResult[i].close * stock)).toFixed(2))
          history.push(list)
        } else if (decreaseAct === "sell" && stock > 0) {
          console.log("跌要賣 ")
          console.log("股票庫存為 ", property)
          let list = {};
          // 賣出手續費
          let sellCost = (caseResult[i].close * decreaseCount * buyCostPercent * discount) + (caseResult[i].close * decreaseCount * sellCostPercent);

          list.profitPercent = (((property + (stock * caseResult[i].close)) - sellCost) - propertyInit).toFixed(2)

          // 累積交易成本
          tradeCost += sellCost;
          // 庫存stock數量
          stock -= decreaseCount;

          // 總資產扣除
          property = property - sellCost + (caseResult[i].close * decreaseCount);

          list.information = caseResult[i].date;
          list.situation = decreaseAct;
          list.price = caseResult[i].close
          list.stock = stock
          list.value = caseResult[i].close;
          list.tradeCost = Number((sellCost).toFixed(2))
          list.property = Number((property + (caseResult[i].close * stock)).toFixed(2));
          history.push(list)
        }

      }
    }


    // for (let i = 0; i < caseResult.length; i++) {
    //   let list = {};
    //   if (property > 0 && caseResult[i].changes >= decrease) {
    //     console.log("資產",property)
    //     // 購買手續費
    //     let buyCost = caseResult[i].close * buy * buyCostPercent * discount;
    //     list.profitPercent = (((property + (stock * caseResult[i].close)) - buyCost) - propertyInit).toFixed(2)
    //     // 累積交易成本
    //     tradeCost += buyCost;
    //     // 庫存stock數量
    //     stock += buy;

    //     // 總資產扣除
    //     property = property - buyCost - (caseResult[i].close * buy)

    //     list.information = caseResult[i].date;
    //     list.situation = "buy";
    //     list.price = caseResult[i].close
    //     list.stock = stock
    //     list.value = caseResult[i].close;
    //     list.tradeCost = Number((buyCost).toFixed(2))
    //     list.property = Number((property + (caseResult[i].close * stock)).toFixed(2))
    //     history.push(list)
    //   } else if (caseResult[i].changes >= increase && stock > 0) {

    //     // 賣出手續費
    //     let sellCost = (caseResult[i].close * sell * buyCostPercent * discount) + (caseResult[i].close * sell * sellCostPercent);

    //     list.profitPercent = (((property + (stock * caseResult[i].close)) - sellCost) - propertyInit).toFixed(2)

    //     // 累積交易成本
    //     tradeCost += sellCost;
    //     // 庫存stock數量
    //     stock -= sell;

    //     // 總資產扣除
    //     property = property - sellCost + (caseResult[i].close * sell);

    //     list.information = caseResult[i].date;
    //     list.situation = "sell";
    //     list.price = caseResult[i].close
    //     list.stock = stock
    //     list.value = caseResult[i].close;
    //     list.tradeCost = Number((sellCost).toFixed(2))
    //     list.property = Number((property + (caseResult[i].close * stock)).toFixed(2));
    //     history.push(list)
    //   }
    // }
    // console.log("股票庫存", stock);
    // console.log("資產總額",profit);
    // console.log("交易成本", tradeCost)
    // console.log("獲利率", profitPercent)
    // console.log("淨利", parseInt(data.property) - property);
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
    }
    
    data.push(caseData)
  }
  console.log({data})
  res.send({data})
}

module.exports = {
  singleStock,
  option,
  backTest,
  option2,
};
