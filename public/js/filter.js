var dim = {
  // 繪圖區
  width: 930,
  height: 750, //最底部x軸
  margin: { top: 50, right: 60, bottom: 50, left: 60 },
  ohlc: { height: 405 },
  indicator: { height: 90, padding: 20 }, // 調整第二個圖層
};
dim.plot = {
  // 裡面圖形區
  width: dim.width - dim.margin.left - dim.margin.right,
  height: dim.height - dim.margin.top - dim.margin.bottom,
}; // 調整第二個圖層

// K線圖的x
var x = techan.scale.financetime().range([0, dim.plot.width]); // y-Right軸

// K線圖的y
var y = d3.scaleLinear().range([dim.ohlc.height, 0]); // y 上下scale

var yPercent = y.copy(); // Same as y at this stage, will get a different domain later

async function d3init() {
  var dim = {
    // 繪圖區
    width: 930,
    height: 750, //最底部x軸
    margin: { top: 50, right: 60, bottom: 50, left: 60 },
    ohlc: { height: 405 },
    indicator: { height: 90, padding: 20 }, // 調整第二個圖層
  };
  dim.plot = {
    // 裡面圖形區
    width: dim.width - dim.margin.left - dim.margin.right,
    height: dim.height - dim.margin.top - dim.margin.bottom,
  }; // 調整第二個圖層
  dim.indicator.top = dim.ohlc.height + dim.indicator.padding; // +開-收
  dim.indicator.bottom =
    dim.indicator.top + dim.indicator.height + dim.indicator.padding; // +開-收

  var indicatorTop = d3
    .scaleLinear()
    .range([dim.indicator.top, dim.indicator.bottom]);

  // var parseDate = d3.timeParse("%d-%b-%y");
  var parseDate = d3.timeParse("%Y%m%d");

  var zoom = d3
    .zoom()
    .scaleExtent([1, 5]) //設定縮放大小1 ~ 5倍
    .translateExtent([
      [0, 0],
      [dim.plot.width, dim.plot.height],
    ]) // 設定可以縮放的範圍，註解掉就可以任意拖曳
    .extent([
      [dim.margin.left, dim.margin.top],
      [dim.plot.width, dim.plot.height],
    ])
    .on("zoom", zoomed);

  // K線圖的x
  var x = techan.scale.financetime().range([0, dim.plot.width]); // y-Right軸

  // K線圖的y
  var y = d3.scaleLinear().range([dim.ohlc.height, 0]); // y 上下scale

  var yPercent = y.copy(); // Same as y at this stage, will get a different domain later

  var yInit, yPercentInit, zoomableInit;

  // 成交量的y
  var yVolume = d3.scaleLinear().range([y(0), y(0.2)]);

  //k bar
  var candlestick = techan.plot.candlestick().xScale(x).yScale(y);

  //close
  let close = techan.plot.close().xScale(x).yScale(y);

  var tradearrow = techan.plot
    .tradearrow()
    .xScale(x)
    .yScale(y)
    .y(function (d) {
      // Display the buy and sell arrows a bit above and below the price, so the price is still visible
      if (d.type === "buy") return y(d.low) + 5;
      if (d.type === "sell") return y(d.high) - 5;
      else return y(d.price);
    });

  var sma0 = techan.plot.sma().xScale(x).yScale(y);

  var sma1 = techan.plot.sma().xScale(x).yScale(y);

  var ema2 = techan.plot.ema().xScale(x).yScale(y);

  var volume = techan.plot
    .volume()
    .accessor(close.accessor())
    .xScale(x)
    .yScale(yVolume);
  // .accessor(candlestick.accessor()); // Set the accessor to a ohlc accessor so we get highlighted bars

  var trendline = techan.plot.trendline().xScale(x).yScale(y);

  var supstance = techan.plot.supstance().xScale(x).yScale(y);

  var xAxis = d3.axisBottom(x);

  // 設定十字線上下顯示的時間

  // 底部x軸時間
  var timeAnnotation = techan.plot
    .axisannotation()
    .axis(xAxis)
    .orient("bottom")
    .format(d3.timeFormat("%Y-%m-%d"))
    .width(90)
    .height(20)
    .translate([0, dim.plot.height]); //矩形座標

  var yAxis = d3.axisRight(y); //右邊close y軸座標標示方向

  // 右側滑鼠標誌
  var ohlcAnnotation = techan.plot
    .axisannotation()
    .axis(yAxis)
    .orient("right") // 右側標誌
    .format(d3.format(",.2f")) //指定小數點後有幾位數
    .translate([x(1), 0]) //矩形座標
    .width(60)
    .height(20);

  //右側最後收盤價顯示
  var closeAnnotation = techan.plot
    .axisannotation()
    .axis(yAxis)
    .orient("right")
    // .accessor(candlestick.accessor())
    .accessor(close.accessor())
    .format(d3.format(",.2f"))
    .translate([x(1), 0])
    .width(60)
    .height(20);

  var percentAxis = d3
    .axisLeft(yPercent) // 左邊%滑鼠標示方向
    .tickFormat(d3.format("+.1%")); //以 f 為基礎，返回乘以 100 後加上 %

  var percentAnnotation = techan.plot
    .axisannotation()
    .axis(percentAxis)
    .orient("left") // 左邊%座標標示方向
    .width(60)
    .height(20);

  //左側最後成交量軸
  var volumeAxis = d3
    .axisRight(yVolume)
    .ticks(3) // volume座標間隔
    .tickFormat(d3.format(",.3s")); // 以 r 為基礎，但帶有一個單位碼 ( 例如 9.5M、或 1.00µ )

  //左側最後成交量顯示
  var volumeAnnotation = techan.plot
    .axisannotation()
    .axis(volumeAxis)
    .orient("right")
    .width(50)
    .height(20);

  // ------------------- macd ------------------

  var macdScale = d3
    .scaleLinear()
    .range([indicatorTop(0) + dim.indicator.height, indicatorTop(0)]);

  var macd = techan.plot.macd().xScale(x).yScale(macdScale);

  var macdAxis = d3.axisRight(macdScale).ticks(3); // 右側macd間距

  var macdAnnotation = techan.plot
    .axisannotation()
    .axis(macdAxis)
    .orient("right")
    .format(d3.format(",.2f"))
    .translate([x(1), 0])
    .width(60)
    .height(20);

  var macdAxisLeft = d3.axisLeft(macdScale).ticks(3);

  var macdAnnotationLeft = techan.plot
    .axisannotation()
    .axis(macdAxisLeft)
    .orient("left")
    .format(d3.format(",.2f"))
    .width(60)
    .height(20);

  // ------------------- ris ------------------

  var rsiScale = macdScale
    .copy()
    .range([indicatorTop(1) + dim.indicator.height, indicatorTop(1)]);

  var rsi = techan.plot.rsi().xScale(x).yScale(rsiScale);

  var rsiAxis = d3.axisRight(rsiScale).ticks(3);

  var rsiAnnotation = techan.plot
    .axisannotation()
    .axis(rsiAxis)
    .orient("right")
    .format(d3.format(",.2f"))
    .translate([x(1), 0])
    .width(60)
    .height(20);

  var rsiAxisLeft = d3.axisLeft(rsiScale).ticks(3);

  var rsiAnnotationLeft = techan.plot
    .axisannotation()
    .axis(rsiAxisLeft)
    .orient("left")
    .format(d3.format(",.2f"))
    .width(60)
    .height(20);

  var ohlcCrosshair = techan.plot
    .crosshair()
    .xScale(timeAnnotation.axis().scale())
    .yScale(ohlcAnnotation.axis().scale())
    .xAnnotation(timeAnnotation)
    .yAnnotation([ohlcAnnotation, percentAnnotation, volumeAnnotation])
    .verticalWireRange([0, dim.plot.height])
    .on("move", move);

  var macdCrosshair = techan.plot
    .crosshair()
    .xScale(timeAnnotation.axis().scale())
    .yScale(macdAnnotation.axis().scale())
    .xAnnotation(timeAnnotation)
    .yAnnotation([macdAnnotation, macdAnnotationLeft])
    .verticalWireRange([0, dim.plot.height]);

  var rsiCrosshair = techan.plot
    .crosshair()
    .xScale(timeAnnotation.axis().scale())
    .yScale(rsiAnnotation.axis().scale())
    .xAnnotation(timeAnnotation)
    .yAnnotation([rsiAnnotation, rsiAnnotationLeft])
    .verticalWireRange([0, dim.plot.height]);

  let a = $("<div>").attr("class", "graph123");
  $("#select").append(a);

  var svg = d3
    .select(".graph123")
    .append("svg")
    .attr("width", dim.width)
    .attr("height", dim.height);

  var defs = svg.append("defs");

  defs
    .append("clipPath")
    .attr("id", "ohlcClip")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", dim.plot.width)
    .attr("height", dim.ohlc.height);

  defs
    .selectAll("indicatorClip")
    .data([0, 1])
    .enter()
    .append("clipPath")
    .attr("id", function (d, i) {
      return "indicatorClip-" + i;
    })
    .append("rect")
    .attr("x", 0)
    .attr("y", function (d, i) {
      return indicatorTop(i);
    })
    .attr("width", dim.plot.width)
    .attr("height", dim.indicator.height);

  svg = svg
    .append("g")
    .attr(
      "transform",
      "translate(" + dim.margin.left + "," + dim.margin.top + ")"
    );

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + dim.plot.height + ")");

  var ohlcSelection = svg
    .append("g")
    .attr("class", "ohlc")
    .attr("transform", "translate(0,0)");

  ohlcSelection
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + x(1) + ",0)")
    .append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", -20)
    .attr("x", 55)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Price (NTD)");

  ohlcSelection.append("g").attr("class", "close annotation up");

  ohlcSelection
    .append("g")
    .attr("class", "volume")
    .attr("clip-path", "url(#ohlcClip)");

  // ohlcSelection
  //   .append("g")
  //   .attr("class", "candlestick")
  //   // .attr("class", "close")
  //   .attr("clip-path", "url(#ohlcClip)");

  ohlcSelection
    .append("g")
    .attr("class", "indicator sma ma-0")
    .attr("clip-path", "url(#ohlcClip)");

  ohlcSelection
    .append("g")
    .attr("class", "indicator sma ma-1")
    .attr("clip-path", "url(#ohlcClip)");

  ohlcSelection
    .append("g")
    .attr("class", "indicator ema ma-2")
    .attr("clip-path", "url(#ohlcClip)");

  ohlcSelection.append("g").attr("class", "percent axis");

  ohlcSelection.append("g").attr("class", "volume axis");

  var indicatorSelection = svg
    .selectAll("svg > g.indicator")
    .data(["macd", "rsi"])
    .enter()
    .append("g")
    .attr("class", function (d) {
      return d + " indicator";
    });

  indicatorSelection
    .append("g")
    .attr("class", "axis right")
    .attr("transform", "translate(" + x(1) + ",0)");

  indicatorSelection
    .append("g")
    .attr("class", "axis left")
    .attr("transform", "translate(" + x(0) + ",0)");

  indicatorSelection
    .append("g")
    .attr("class", "indicator-plot")
    .attr("clip-path", function (d, i) {
      return "url(#indicatorClip-" + i + ")";
    });

  // Add trendlines and other interactions last to be above zoom pane
  svg.append("g").attr("class", "crosshair ohlc");

  svg
    .append("g")
    .attr("class", "tradearrow")
    .attr("clip-path", "url(#ohlcClip)");

  svg.append("g").attr("class", "crosshair macd");

  svg.append("g").attr("class", "crosshair rsi");

  svg
    .append("g")
    .attr("class", "trendlines analysis")
    .attr("clip-path", "url(#ohlcClip)");

  svg
    .append("g")
    .attr("class", "supstances analysis")
    .attr("clip-path", "url(#ohlcClip)");

  // // 設定文字區域
  // var textSvg = d3.select("#navBar").append("svg")
  //   .attr("width", dim.width + dim.margin.left + dim.margin.right)
  //   .attr("height", dim.margin.top + dim.margin.bottom)
  //   .append("g")
  //   .attr("transform", "translate(" + dim.margin.left + "," + dim.margin.top + ")");

  // // 設定文字區域
  // var textSvg = svg
  //   .append("svg")

  // //設定顯示文字，web版滑鼠拖曳就會顯示，App上則是要點擊才會顯示
  // var svgText = textSvg.append("g")
  //   .attr("class", "symbol")
  //   .append("text")
  //   .attr("y", 6)
  //   .attr("x", 12)
  //   .attr("dy", ".71em")
  //   .style("text-anchor", "start");

  // color block
  svg
    .append("rect")
    .attr("class", "symbols")
    .attr("x", 16) //越大越右邊
    .attr("y", 2) //越大越下面
    .attr("width", "155")
    .attr("height", "165")
    .attr("opacity", 0.15);

  // corp name
  svg.append("text").attr("class", "symbols");

  const corp_text = svg
    .append("text")
    .attr("class", "value corp")
    .attr("x", 20)
    .attr("y", 20)
    .text("");

  const date_text = svg
    .append("text")
    .attr("class", "value date_text")
    .attr("x", 95)
    .attr("y", 20)
    .text("");

  // Open
  svg
    .append("text")
    .attr("class", "value open")
    .attr("x", 20)
    .attr("y", 40)
    .text("Open");
  const open_text = svg
    .append("text")
    .attr("class", "value open")
    .attr("x", 95)
    .attr("y", 40)
    .text("");

  // High
  svg
    .append("text")
    .attr("class", "value high")
    .attr("x", 20)
    .attr("y", 60)
    .text("High");
  const high_text = svg
    .append("text")
    .attr("class", "value high")
    .attr("x", 95)
    .attr("y", 60)
    .text("");

  // Low
  svg
    .append("text")
    .attr("class", "value low")
    .attr("x", 20)
    .attr("y", 80)
    .text("Low");
  const low_text = svg
    .append("text")
    .attr("class", "value low")
    .attr("x", 95)
    .attr("y", 80)
    .text("");

  // Close
  svg
    .append("text")
    .attr("class", "value close")
    .attr("x", 20)
    .attr("y", 100)
    .text("Close");
  const close_text = svg
    .append("text")
    .attr("class", "value close")
    .attr("x", 95)
    .attr("y", 100)
    .text("");

  // change
  svg
    .append("text")
    .attr("class", "value changes")
    .attr("x", 20)
    .attr("y", 120)
    .text("change");
  const change_text = svg
    .append("text")
    .attr("class", "value changes")
    .attr("x", 95)
    .attr("y", 120)
    .text("");

  // change percent
  svg
    .append("text")
    .attr("class", "value percentChange")
    .attr("x", 20)
    .attr("y", 140)
    .text("change(%)");
  const percentChange_text = svg
    .append("text")
    .attr("class", "value percentChange")
    .attr("x", 95)
    .attr("y", 140)
    .text("");

  // Volume
  svg
    .append("text")
    .attr("class", "value volume")
    .attr("x", 20)
    .attr("y", 160)
    .text("Volume");
  const volume_text = svg
    .append("text")
    .attr("class", "value volume")
    .attr("x", 95)
    .attr("y", 160)
    .text("");

  let d3data = {
    parseDate: parseDate,
    zoom: zoom,
    yInit: yInit,
    yPercentInit: yPercentInit,
    zoomableInit: zoomableInit,
    close: close,
    tradearrow: tradearrow,
    sma0: sma0,
    sma1: sma1,
    ema2: ema2,
    volume: volume,
    trendline: trendline,
    supstance: supstance,
    closeAnnotation: closeAnnotation,
    macd: macd,
    rsi: rsi,
    ohlcCrosshair: ohlcCrosshair,
    macdCrosshair: macdCrosshair,
    rsiCrosshair: rsiCrosshair,
    corp_text: corp_text,
    date_text: date_text,
    open_text: open_text,
    high_text: high_text,
    low_text: low_text,
    close_text: close_text,
    changes_text: change_text,
    percentChange_text: percentChange_text,
    volume_text: volume_text,
    ohlcSelection: ohlcSelection,
    candlestick: candlestick,
    x: x,
    y: y,
    yPercent: yPercent,
    macdScale: macdScale,
    rsiScale: rsiScale,
    svg: svg,
    xAxis: xAxis,
    yAxis: yAxis,
    percentAxis: percentAxis,
    macdAxis: macdAxis,
    rsiAxis: rsiAxis,
    macdAxisLeft: macdAxisLeft,
    rsiAxisLeft: rsiAxisLeft,
    yVolume: yVolume,
    volumeAxis: volumeAxis,
  };

  return d3data;
}

async function smaAndema() {
  let localData = localStorage.getItem("home");
  let parseDate = JSON.parse(localData);

  let data = [];
  for (let i = 0; i < parseDate.length; i++) {
    let oldDate = parseDate[i].date;
    parseDate[i].date = new Date(oldDate);
    data.push(parseDate[i]);
  }

  qq.ohlcSelection
    .append("g")
    .attr("class", "indicator sma ma-0")
    .attr("clip-path", "url(#ohlcClip)");

  qq.ohlcSelection
    .append("g")
    .attr("class", "indicator sma ma-1")
    .attr("clip-path", "url(#ohlcClip)");

  qq.ohlcSelection
    .append("g")
    .attr("class", "indicator ema ma-2")
    .attr("clip-path", "url(#ohlcClip)");

  qq.svg
    .select("g.sma.ma-0")
    .datum(techan.indicator.sma().period(10)(data))
    .call(qq.sma0);
  qq.svg
    .select("g.sma.ma-1")
    .datum(techan.indicator.sma().period(20)(data))
    .call(qq.sma1);
  qq.svg
    .select("g.ema.ma-2")
    .datum(techan.indicator.ema().period(50)(data))
    .call(qq.ema2);
}

async function smaCancel() {
  d3.select(".indicator").remove();
  d3.select(".indicator").remove();
  d3.select(".indicator").remove();

  qq.ohlcSelection
    .append("g")
    .attr("class", "indicator sma ma-0")
    .attr("clip-path", "url(#ohlcClip)");

  qq.ohlcSelection
    .append("g")
    .attr("class", "indicator sma ma-1")
    .attr("clip-path", "url(#ohlcClip)");

  qq.ohlcSelection
    .append("g")
    .attr("class", "indicator ema ma-2")
    .attr("clip-path", "url(#ohlcClip)");
}

async function volumeCancel() {
  d3.select(".volume").remove();
  d3.select(".volume.axis").remove();

  qq.ohlcSelection
    .append("g")
    .attr("class", "volume")
    .attr("clip-path", "url(#ohlcClip)");

  qq.ohlcSelection.append("g").attr("class", "volume axis");
}

async function volumeRender() {
  let localData = localStorage.getItem("home");
  let parseDate = JSON.parse(localData);

  let data = [];
  for (let i = 0; i < parseDate.length; i++) {
    let oldDate = parseDate[i].date;
    parseDate[i].date = new Date(oldDate);
    data.push(parseDate[i]);
  }
  console.log(data);
  qq.ohlcSelection
    .append("g")
    .attr("class", "volume")
    .attr("clip-path", "url(#ohlcClip)");

  qq.yVolume.domain(techan.scale.plot.volume(data).domain());
  qq.svg.select("g.volume").datum(data).call(qq.volume);

  qq.svg.select("g.volume.axis").call(qq.volumeAxis);
  qq.svg.select("g.volume").call(qq.volume.refresh);
}

function renderInfor(data) {
  $(".name").remove();
  $(".price").remove();
  $(".change").remove();
  console.log(data)
  let len = data.length;
  let infor = data[len - 1];
  let name = $("<div>")
    .attr("class", "name")
    .append(`${infor.name}(${infor.code}.TW)`);
  let price = $("<div>")
    .attr("class", "price")
    .append(`${infor.close}`)
    .css("color", "#ffffff");
  let change = $("<div>")
    .attr("class", "change")
    .append(`${infor.change}` + " " + `(${infor.percentChange}%)`);

  if (infor.change[0] !== "-") {
    change.css("color", "red");
  } else if (infor.change[0] === "0") {
    change.css("color", "#ffffff");
  } else {
    change.css("color", "green");
  }
  $(".info").append(name).append(price).append(change);
}

async function kBarRender() {
  $("#realTime").css("border-buttom-color", "#656565");
  $("#trend").css("border-bottom-color", "#ffffff");
  $("#finance").css("border-buttom-color", "#656565");
  $("#news").css("border-buttom-color", "#656565");
  $("#information").css("border-buttom-color", "#656565");

  $("#realTime").css("color", "#656565");
  $("#trend").css("color", "#ffffff");
  $("#finance").css("color", "#656565");
  $("#news").css("color", "#656565");
  $("#information").css("color", "#656565");

  $("#kBar").css("border-buttom-color", "1px solid #656565");
  $("#line").css("border-buttom-color", "1px solid #656565");

  d3.select(".graph123").remove();
  qq = await d3init();

  let localData = localStorage.getItem("choiceStockData");
  let trendDatas = localStorage.getItem("choiceStockTrend");
  let datas = JSON.parse(localData);
  let trendData = JSON.parse(trendDatas);

  await renderInfor(datas);

  let data = [];

  for (let i = 0; i < datas.length; i++) {
    let oldDate = datas[i].date;
    datas[i].date = new Date(oldDate);
    data.push(datas[i]);
  }

  let trend = [];
  for (let i = 0; i < trendData.length; i++) {

    let startOldDates = (trendData[i].startDate).toString();
    let endOldDates = (trendData[i].endDate).toString();
    let startDate = startOldDates[0] + startOldDates[1] + startOldDates[2] + startOldDates[3] + '/' + startOldDates[4] + startOldDates[5] + '/' + startOldDates[6] + startOldDates[7];
    let endDate = endOldDates[0] + endOldDates[1] + endOldDates[2] + endOldDates[3] + '/' + endOldDates[4] + endOldDates[5] + '/' + endOldDates[6] + endOldDates[7];

    trendData[i].startDate = new Date(startDate);
    trendData[i].endDate = new Date(endDate);
    trendData[i].startPrice = trendData[i].startPrice;
    trendData[i].endPrice = trendData[i].endPrice;

    trend.push(trendData[i]);
  }
  console.log(trend)
  let trendlineData = [];
  for (let i = 0; i < trend.length; i++) {
    let index = {
      start: {
        date: trend[i].startDate,
        value: trend[i].startPrice,
      },
      end: {
        date: trend[i].endDate,
        value: trend[i].endPrice,
      }
    }
    trendlineData.push(index)
  }

  console.log(trendlineData)

  qq.ohlcSelection
    .append("g")
    .attr("class", "candlestick")
    // .attr("class", "close")
    .attr("clip-path", "url(#ohlcClip)");

  var accessor = qq.candlestick.accessor(),
    indicatorPreRoll = 33; // Don't show where indicators don't have data
  // var accessor = close.accessor(),
  //   indicatorPreRoll = 33; // Don't show where indicators don't have data

  qq.x.domain(techan.scale.plot.time(data).domain());
  qq.y.domain(techan.scale.plot.ohlc(data.slice(indicatorPreRoll)).domain());

  qq.yPercent.domain(
    techan.scale.plot.percent(qq.y, accessor(data[indicatorPreRoll])).domain()
  );

  var macdData = techan.indicator.macd()(data);
  qq.macdScale.domain(techan.scale.plot.macd(macdData).domain());
  var rsiData = techan.indicator.rsi()(data);
  qq.rsiScale.domain(techan.scale.plot.rsi(rsiData).domain());

  qq.svg.select("g.candlestick").datum(data).call(qq.candlestick);

  // qq.svg
  //   .select("g.close.annotation")
  //   .datum([data[data.length - 1]])
  //   .call(qq.closeAnnotation);
  // qq.svg.select("g.volume").datum(data).call(qq.volume);

  qq.svg.select("g.macd .indicator-plot").datum(macdData).call(qq.macd);
  qq.svg.select("g.rsi .indicator-plot").datum(rsiData).call(qq.rsi);

  qq.svg.select("g.crosshair.ohlc").call(qq.ohlcCrosshair).call(qq.zoom);
  qq.svg.select("g.crosshair.macd").call(qq.macdCrosshair).call(qq.zoom);
  qq.svg.select("g.crosshair.rsi").call(qq.rsiCrosshair).call(qq.zoom);
  qq.svg.select("g.trendlines").datum(trendlineData).call(qq.trendline).call(qq.trendline.drag);

  // Stash for zooming
  zoomableInit = qq.x.zoomable().domain([indicatorPreRoll, data.length]).copy(); // Zoom in a little to hide indicator preroll
  yInit = qq.y.copy();
  yPercentInit = qq.yPercent.copy();
  console.log("kbarOK");
  draw(qq);
}

async function closeRender() {
  $("#realTime").css("border-buttom", "1px solid #656565");
  $("#trend").css("border-buttom", "1px solid #323232");
  $("#finance").css("border-buttom", "1px solid #656565");
  $("#news").css("border-buttom", "1px solid #656565");
  $("#information").css("border-buttom", "1px solid #656565");

  $("#kBar").css("border-buttom", "1px solid #656565");
  $("#line").css("border-buttom", "1px solid #656565");

  d3.select(".graph123").remove();
  qq = await d3init();

  let localData = localStorage.getItem("choiceStockData");
  let trendDatas = localStorage.getItem("choiceStockTrend");
  let datas = JSON.parse(localData);
  let trendData = JSON.parse(trendDatas);

  let data = [];

  for (let i = 0; i < datas.length; i++) {
    let oldDate = datas[i].date;
    datas[i].date = new Date(oldDate);
    data.push(datas[i]);
  }

  let trend = [];
  for (let i = 0; i < trendData.length; i++) {

    let startOldDates = (trendData[i].startDate).toString();
    let endOldDates = (trendData[i].endDate).toString();
    let startDate = startOldDates[0] + startOldDates[1] + startOldDates[2] + startOldDates[3] + '/' + startOldDates[4] + startOldDates[5] + '/' + startOldDates[6] + startOldDates[7];
    let endDate = endOldDates[0] + endOldDates[1] + endOldDates[2] + endOldDates[3] + '/' + endOldDates[4] + endOldDates[5] + '/' + endOldDates[6] + endOldDates[7];

    trendData[i].startDate = new Date(startDate);
    trendData[i].endDate = new Date(endDate);
    trendData[i].startPrice = trendData[i].startPrice;
    trendData[i].endPrice = trendData[i].endPrice;

    trend.push(trendData[i]);
  }
  console.log(trend)
  let trendlineData = [];
  for (let i = 0; i < trend.length; i++) {
    let index = {
      start: {
        date: trend[i].startDate,
        value: trend[i].startPrice,
      },
      end: {
        date: trend[i].endDate,
        value: trend[i].endPrice,
      }
    }
    trendlineData.push(index)
  }

  console.log(trendlineData)

  qq.ohlcSelection
    .append("g")
    // .attr("class", "candlestick")
    .attr("class", "close")
    .attr("clip-path", "url(#ohlcClip)");

  var accessor = qq.close.accessor(),
    indicatorPreRoll = 33; // Don't show where indicators don't have data

  qq.x.domain(techan.scale.plot.time(data).domain());
  qq.y.domain(techan.scale.plot.ohlc(data.slice(indicatorPreRoll)).domain());
  qq.yPercent.domain(
    techan.scale.plot.percent(qq.y, accessor(data[indicatorPreRoll])).domain()
  );

  var macdData = techan.indicator.macd()(data);
  qq.macdScale.domain(techan.scale.plot.macd(macdData).domain());
  var rsiData = techan.indicator.rsi()(data);
  qq.rsiScale.domain(techan.scale.plot.rsi(rsiData).domain());

  qq.svg.selectAll("g.close").datum(data).call(qq.close);
  // let a = svg.selectAll("g.close").datum(data).call(close);

  // qq.svg
  //   .select("g.close.annotation")
  //   .datum([data[data.length - 1]])
  //   .call(qq.closeAnnotation);
  // qq.svg.select("g.volume").datum(data).call(qq.volume);

  qq.svg.select("g.macd .indicator-plot").datum(macdData).call(qq.macd);
  qq.svg.select("g.rsi .indicator-plot").datum(rsiData).call(qq.rsi);

  qq.svg.select("g.crosshair.ohlc").call(qq.ohlcCrosshair).call(qq.zoom);
  qq.svg.select("g.crosshair.macd").call(qq.macdCrosshair).call(qq.zoom);
  qq.svg.select("g.crosshair.rsi").call(qq.rsiCrosshair).call(qq.zoom);
  qq.svg.select("g.trendlines").datum(trendlineData).call(qq.trendline).call(qq.trendline.drag);
  // Stash for zooming
  zoomableInit = qq.x.zoomable().domain([indicatorPreRoll, data.length]).copy(); // Zoom in a little to hide indicator preroll
  yInit = qq.y.copy();
  yPercentInit = qq.yPercent.copy();
  console.log("kbarOK");
  draw(qq);
}

//設定當移動的時候要顯示的文字
async function move(coords, index) {
  let datas = localStorage.getItem("choiceStockData");
  let data = JSON.parse(datas);
  
  var i;
  for (i = 0; i < data.length; i++) {
    if (coords.x.toString() === new Date(data[i].date).toString()) {
      let day = new Date(coords.x);
      let y = day.getFullYear();
      let m = day.getMonth() + 1;
      let d = day.getDate();
      qq.corp_text.text(data[0].name);
      qq.date_text.text(y + "/" + m + "/" + d);
      qq.open_text.text(data[i].open);
      qq.high_text.text(data[i].high);
      qq.low_text.text(data[i].low);
      qq.close_text.text(data[i].close);
      qq.changes_text.text(data[i].change);
      qq.percentChange_text.text(data[i].percentChange);
      qq.volume_text.text(data[i].volume);
    }
  }
}

function reset() {
  zoom.scale(1);
  zoom.translate([0, 0]);
  draw();
}

async function zoomed() {
  // qq = await d3init();
  qq.x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
  qq.y.domain(d3.event.transform.rescaleY(yInit).domain());
  qq.yPercent.domain(d3.event.transform.rescaleY(yPercentInit).domain());

  draw(qq);
}

async function draw(qq) {
  qq.svg.select("g.x.axis").call(qq.xAxis);
  qq.svg.select("g.ohlc .axis").call(qq.yAxis);
  // qq.svg.select("g.volume.axis").call(qq.volumeAxis);
  qq.svg.select("g.percent.axis").call(qq.percentAxis);
  qq.svg.select("g.macd .axis.right").call(qq.macdAxis);
  qq.svg.select("g.rsi .axis.right").call(qq.rsiAxis);
  qq.svg.select("g.macd .axis.left").call(qq.macdAxisLeft);
  qq.svg.select("g.rsi .axis.left").call(qq.rsiAxisLeft);

  // We know the data does not change, a simple refresh that does not perform data joins will suffice.
  qq.svg.select("g.candlestick").call(qq.candlestick.refresh);
  qq.svg.selectAll("g.close").call(qq.close.refresh);
  qq.svg.select("g.close.annotation").call(qq.closeAnnotation.refresh);
  qq.svg.select("g.volume").call(qq.volume.refresh);
  qq.svg.select("g .sma.ma-0").call(qq.sma0.refresh);
  qq.svg.select("g .sma.ma-1").call(qq.sma1.refresh);
  qq.svg.select("g .ema.ma-2").call(qq.ema2.refresh);
  qq.svg.select("g.macd .indicator-plot").call(qq.macd.refresh);
  qq.svg.select("g.rsi .indicator-plot").call(qq.rsi.refresh);
  qq.svg.select("g.crosshair.ohlc").call(qq.ohlcCrosshair.refresh);
  qq.svg.select("g.crosshair.macd").call(qq.macdCrosshair.refresh);
  qq.svg.select("g.crosshair.rsi").call(qq.rsiCrosshair.refresh);
  qq.svg.select("g.trendlines").call(qq.trendline.refresh);
  qq.svg.select("g.supstances").call(qq.supstance.refresh);
  qq.svg.select("g.tradearrow").call(qq.tradearrow.refresh);
}

// NAV GET DATA
async function getData() {
  if ($(".search").val() !== "") {
    let code = $(".search").val();
    localStorage.setItem("homeCode", code);
    let startDate = "";
    let endDate = "";

    if (code === "") {
      code = "2330";
    }

    let userSearch = {
      stockCode: code,
      startDate: startDate,
      endDate: endDate,
    };

    fetch(`api/1.0/singleStock`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(userSearch),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.error) {
          alert(body.error);
          return;
        }
        for (let i = 0; i < body.data.length; i++) {
          let strDate = body.data[i].date.toString();
          let y = strDate[0] + strDate[1] + strDate[2] + strDate[3] + "/";
          let m = strDate[4] + strDate[5] + "/";
          let d = strDate[6] + strDate[7];
          body.data[i].date = new Date(y + m + d);
        }

        let datas = JSON.stringify(body.data);
        localStorage.setItem("home", datas);
        window.location.replace("/index.html");
      });
  } else {
    return;
  }
}


function option() {
  window.location.replace("../option.html");
}

function backTest(code) {
  localStorage.setItem("backCode", code);
  window.location.replace("../backTest.html");
}


$(".search").on("keypress", function (e) {
  if (e.key === "Enter") {
    getData();
  }
});

$(".chart").change(function () {
  var t = $(this).val();
  if (t === "Candle") {
    kBarRender();
  } else {
    closeRender();
  }
});

function checkVolume() {
  if ($(".volumes").is(":checked") === true) {
    volumeRender();
  } else {
    volumeCancel();
  }
}

function checkMA() {
  if ($(".ma").is(":checked") === true) {
    smaAndema();
  } else {
    smaCancel();
  }
}

function indicate() {
  let display = $(".indicate").css("display");
  if (display === "none") {
    $(".indicate").css("display", "block");
  } else {
    $(".indicate").css("display", "none");
  }
}

// --------------------------------------------


function renderList() {
  if (localStorage.getItem("optionResult") && localStorage.getItem("filterDate")) {
    let data = JSON.parse(localStorage.getItem("optionResult"));
    let date = localStorage.getItem("filterDate");
    console.log(data);

    // user search condition
    var tr = $("<tr>").attr("class", `userOption`).append(
      $("<td>").attr("class", "userChoice").append(data.inf.start),
      $("<td>").attr("class", "userChoice").append(data.inf.end),
      $("<td>").attr("class", "userChoice").append(data.inf.upper),
      $("<td>").attr("class", "userChoice").append(data.inf.lower),
      $("<td>").attr("class", "userChoice").append(data.inf.graph),
      $("<td>").attr("class", "userChoice").append(data.inf.count),
      $("<td>").attr("class", "userChoice").append(data.inf.increase),
      $("<td>").attr("class", "userChoice").append(data.inf.decrease),
      // $("<td>").attr("class", "userChoice").append(data.inf.rank),
      // $("<td>").attr("class", "userChoice").append(data.inf.high)
    );
    $("#userOption").append(tr);

    let target = 0;
    for (let i = 0; i < data.data[0].data.length; i++) {
      if (data.data[0].data[i].date.toString() === date) {
        target += i;
        break;
      }
    }
    console.log("A")
    let currentDate = $("<div>").attr("id", "cDate").append(`${date}`);
    $("#currentDate").append(currentDate);

    for (let i = 0; i < data.data.length; i++) {
      $("#recommend").remove();
    }
    console.log("B")
    for (let i = 0; i < data.data.length; i++) {
      let priceLen = target + 1;
      let code = data.data[i].data[priceLen - 1].code;
      let btn = $("<button>")
        .text("Apply")
        .click(function () {
          backTest(code);
        });
      var tr = $("<tr>")
        .attr("class", `userOption`)
        .append(
          $("<td>").attr("class", "userChoice").attr("class", `code${i}`).click(function () {
              `${choiceStock(data.data[i].data)}`;
            }).append(data.data[i].data[priceLen - 1].code),
          $("<td>").attr("class", "userChoice").click(function () {
              `${choiceStock(data.data[i].data)}`;
            }).append(data.data[i].data[priceLen - 1].name),
          $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].close),
          $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].percentChange),
          $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].volume),
          $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].industry),
          $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].total),
          $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].fd),
          $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].sitc),
          $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].dealers),
          // $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].mc),
          // $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].pe),
          // $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].dy),
          // $("<td>").attr("class", "userChoice").append(data.data[i].data[priceLen - 1].pb),
          $("<td>").attr("class", "userChoice").attr("value", `${i}`).append(btn)
        );
      $(".resultTable").append(tr);
    }
    console.log("D")
  } else {
    alert("還沒有選過篩選條件哦!");
    window.location.replace("./option.html");
  }
}

function choiceStock(data) {
  // if (localStorage.getItem('currentStock')) {
  //   if (localStorage.getItem('currentStock') === data[0].code) {
  //     console.log('依樣')
  //     return;
  //   } else {
  //     console.log('不一樣')
  //     localStorage.setItem('currentStock', data[0].code)
  //   }
  // } else {
  //   console.log('沒東西')
  localStorage.setItem("filterCode", data[0].code);
  // }

  let optionStock = localStorage.getItem('optionResult');
  let optionResult = JSON.parse(optionStock);
  let choice = localStorage.getItem("filterCode");
  let choiceStock = JSON.parse(choice);

  for (let i = 0; i < optionResult.data.length; i++) {
    if (Number(optionResult.data[i].id) === choiceStock) {
      for (let j = 0; j < optionResult.data[i].data.length; j++) {
        let strDate = optionResult.data[i].data[j].date.toString();
        let y = strDate[0] + strDate[1] + strDate[2] + strDate[3] + "/";
        let m = strDate[4] + strDate[5] + "/";
        let d = strDate[6] + strDate[7];
        optionResult.data[i].data[j].date = new Date(y + m + d);
      }
      for (let j = 0; j < optionResult.data[i].trend.length; j++) {
        for (let k = 0; k < optionResult.data[i].trend[j].length; k++) {
          let startDate = optionResult.data[i].trend[j][k].startDate.toString();
          let endDate = optionResult.data[i].trend[j][k].endDate.toString();
          let sy =
            startDate[0] + startDate[1] + startDate[2] + startDate[3] + "/";
          let sm = startDate[4] + startDate[5] + "/";
          let sd = startDate[6] + startDate[7];
          let ey = endDate[0] + endDate[1] + endDate[2] + endDate[3] + "/";
          let em = endDate[4] + endDate[5] + "/";
          let ed = endDate[6] + endDate[7];
          optionResult.data[i].trend[j][k].startDate = new Date(sy + sm + sd);
          optionResult.data[i].trend[j][k].endDate = new Date(ey + em + ed);
        }
      }


      $(".name").remove();
      $(".price").remove();
      $(".change").remove();

      let len = optionResult.data[0].data.length;
      let infor = optionResult.data[0].data[len - 1];
      let name = $("<div>")
        .attr("class", "name")
        .append(`${infor.name}(${infor.code}.TW)`);
      let price = $("<div>")
        .attr("class", "price")
        .append(`${infor.close}`)
        .css("color", "#ffffff");
      let change = $("<div>")
        .attr("class", "change")
        .append(`${infor.change}` + " " + `(${infor.percentChange}%)`);

      if (infor.change[0] !== "-") {
        change.css("color", "red");
      } else if (infor.change[0] === "0") {
        change.css("color", "#ffffff");
      } else {
        change.css("color", "green");
      }
      $(".info").append(name).append(price).append(change);

      console.log(optionResult.data[i]);
      let choiceStockData = JSON.stringify(optionResult.data[i].data);
      localStorage.setItem("choiceStockData", choiceStockData);
      let choiceStockTrend = JSON.stringify(optionResult.data[i].trend);
      localStorage.setItem("choiceStockTrend", choiceStockTrend);
      break;
    }
  }
  // console.log(choice)
  kBarRender()
}

function filterData() {
  let code = localStorage.getItem('currentStock');
  let start = $(".startDay").val();
  let end = $(".endDay").val();
  let startDate =
    start.split("-")[0] + start.split("-")[1] + start.split("-")[2];
  let endDate = end.split("-")[0] + end.split("-")[1] + end.split("-")[2];

  let userSearch = {
    stockCode: code,
    startDate: startDate,
    endDate: endDate,
  };

  fetch(`api/1.0/singleStock`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(userSearch),
  })
    .then((res) => res.json())
    .then((body) => {
      console.log(body.data)
      kBarRender();
    });
}


renderList();

if (localStorage.getItem("userToken")) {
  const data = {
    token: localStorage.getItem("userToken"),
  };
  fetch("api/1.0/user/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((body) => {
      if (body.error) {
        $(".member").text(`Sign up / Log in`);
      } else {
        console.log(body);
        $(".member").text(`${body.name}`);
      }
    });
}