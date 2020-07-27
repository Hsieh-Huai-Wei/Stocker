var dim = {
  // 繪圖區
  width: 1100,
  height: 690, //最底部x軸
  margin: { top: 20, right: 50, bottom: 30, left: 50 },
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
  // .accessor(close.accessor())
  .xScale(x)
  .yScale(yVolume)
  .accessor(candlestick.accessor()) // Set the accessor to a ohlc accessor so we get highlighted bars


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
  .width(100)
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
  .width(50)
  .height(25);

//右側最後收盤價顯示
var closeAnnotation = techan.plot
  .axisannotation()
  .axis(yAxis)
  .orient("right")
  .accessor(candlestick.accessor())
  // .accessor(close.accessor())
  .format(d3.format(",.2f"))
  .translate([x(1), 0])
  .width(50)
  .height(25);

var percentAxis = d3
  .axisLeft(yPercent) // 左邊%滑鼠標示方向
  .tickFormat(d3.format("+.1%")); //以 f 為基礎，返回乘以 100 後加上 %

var percentAnnotation = techan.plot
  .axisannotation()
  .axis(percentAxis)
  .orient("left") // 左邊%座標標示方向
  .width(50)
  .height(25);

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
  .height(25);

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
  .width(50)
  .height(25);

var macdAxisLeft = d3.axisLeft(macdScale).ticks(3);

var macdAnnotationLeft = techan.plot
  .axisannotation()
  .axis(macdAxisLeft)
  .orient("left")
  .format(d3.format(",.2f"))
  .width(50)
  .height(25);

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
  .translate([x(1), 0]);

var rsiAxisLeft = d3.axisLeft(rsiScale).ticks(3);

var rsiAnnotationLeft = techan.plot
  .axisannotation()
  .axis(rsiAxisLeft)
  .orient("left")
  .format(d3.format(",.2f"));

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

var svg = d3
  .select("#select")
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
  .attr("transform", "rotate(-90)")
  .attr("y", -12)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Price ($)");

ohlcSelection.append("g").attr("class", "close annotation up");

ohlcSelection
  .append("g")
  .attr("class", "volume")
  .attr("clip-path", "url(#ohlcClip)");

ohlcSelection
  .append("g")
  // .attr("class", "candlestick")
  .attr("class", "close")
  .attr("clip-path", "url(#ohlcClip)");

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

svg.append("g").attr("class", "tradearrow").attr("clip-path", "url(#ohlcClip)");

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

function sma(data) {
  svg
    .select("g.sma.ma-0")
    .datum(techan.indicator.sma().period(10)(data))
    .call(sma0);
  svg
    .select("g.sma.ma-1")
    .datum(techan.indicator.sma().period(20)(data))
    .call(sma1);
  svg
    .select("g.ema.ma-2")
    .datum(techan.indicator.ema().period(50)(data))
    .call(ema2);
}

function tradesLine(trades) {
  // console.log('ok')
  svg.select("g.tradearrow").datum(trades).call(tradearrow);
}

function abc(data) {
  yVolume.domain(techan.scale.plot.volume(data).domain());
}

function renderData(data) {

  // var accessor = candlestick.accessor(),
  // var accessor = candlestick.accessor(),
  var accessor = close.accessor(),
    indicatorPreRoll = 33; // Don't show where indicators don't have data

  x.domain(techan.scale.plot.time(data).domain());
  y.domain(techan.scale.plot.ohlc(data.slice(indicatorPreRoll)).domain());
  yPercent.domain(
    techan.scale.plot.percent(y, accessor(data[indicatorPreRoll])).domain()
  );

  // yVolume.domain(techan.scale.plot.volume(data).domain());

  abc(data)


  var trendlineData = [
    { start: { date: new Date(2020, 2, 11), value: 270 }, end: { date: new Date(2020, 5, 9), value: 320 } },
    { start: { date: new Date(2020, 10, 21), value: 270 }, end: { date: new Date(2020, 2, 17), value: 320 } }
  ];


  var supstanceData = [
    { start: new Date(2020, 2, 11), end: new Date(2020, 5, 9), value: 320.64 },
    { start: new Date(2020, 10, 21), end: new Date(2020, 2, 17), value: 55.50 }
  ];

  var trades = [
    { date: data[100].date, type: "buy", price: data[100].low, low: data[100].low, high: data[100].high },
    // { date: data[100].date, type: "sell", price: data[100].high, low: data[100].low, high: data[100].high },
    // { date: data[130].date, type: "buy", price: data[130].low, low: data[130].low, high: data[130].high },
    // { date: data[170].date, type: "sell", price: data[170].low, low: data[170].low, high: data[170].high }
  ];



  sma(data)

  var macdData = techan.indicator.macd()(data);
  macdScale.domain(techan.scale.plot.macd(macdData).domain());
  var rsiData = techan.indicator.rsi()(data);
  rsiScale.domain(techan.scale.plot.rsi(rsiData).domain());

  // svg.select("g.candlestick").datum(data).call(candlestick);
  svg.selectAll("g.close").datum(data).call(close);

  // let a = svg.select("g.candlestick").datum(data).call(candlestick);
  let a = svg.selectAll("g.close").datum(data).call(close);
  // console.log(a)
  svg
    .select("g.close.annotation")
    .datum([data[data.length - 1]])
    .call(closeAnnotation);
  svg.select("g.volume").datum(data).call(volume);
  // svg
  //   .select("g.sma.ma-0")
  //   .datum(techan.indicator.sma().period(10)(data))
  //   .call(sma0);
  // svg
  //   .select("g.sma.ma-1")
  //   .datum(techan.indicator.sma().period(20)(data))
  //   .call(sma1);
  // svg
  //   .select("g.ema.ma-2")
  //   .datum(techan.indicator.ema().period(50)(data))
  //   .call(ema2);
  svg.select("g.macd .indicator-plot").datum(macdData).call(macd);
  svg.select("g.rsi .indicator-plot").datum(rsiData).call(rsi);

  svg.select("g.crosshair.ohlc").call(ohlcCrosshair).call(zoom);
  svg.select("g.crosshair.macd").call(macdCrosshair).call(zoom);
  svg.select("g.crosshair.rsi").call(rsiCrosshair).call(zoom);

  svg.select("g.trendlines").datum(trendlineData).call(trendline).call(trendline.drag);


  svg.select("g.supstances").datum(supstanceData).call(supstance).call(supstance.drag);




  tradesLine(trades);



  // Stash for zooming
  zoomableInit = x.zoomable().domain([indicatorPreRoll, data.length]).copy(); // Zoom in a little to hide indicator preroll
  yInit = y.copy();
  yPercentInit = yPercent.copy();

  draw();
}

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
  .attr("width", "145")
  .attr("height", "165")
  .attr("opacity", 0.15);


// corp name
svg
  .append("text")
  .attr("class", "symbol")

const corp_text = svg
  .append("text")
  .attr("class", "value corp")
  .attr("x", 20)
  .attr("y", 20)
  .text("");

const date_text = svg
  .append("text")
  .attr("class", "value date_text")
  .attr("x", 115)
  .attr("y", 20)
  .text("");

// Open
svg
  .append("text")
  .attr("class", "value-section")
  .attr("x", 20)
  .attr("y", 40)
  .text("Open");
const open_text = svg
  .append("text")
  .attr("class", "value open")
  .attr("x", 115)
  .attr("y", 40)
  .text("");

// High
svg
  .append("text")
  .attr("class", "value-section")
  .attr("x", 20)
  .attr("y", 60)
  .text("High");
const high_text = svg
  .append("text")
  .attr("class", "value high")
  .attr("x", 115)
  .attr("y", 60)
  .text("");

// Low
svg
  .append("text")
  .attr("class", "value-section")
  .attr("x", 20)
  .attr("y", 80)
  .text("Low");
const low_text = svg
  .append("text")
  .attr("class", "value low")
  .attr("x", 115)
  .attr("y", 80)
  .text("");

// Close
svg
  .append("text")
  .attr("class", "value-section")
  .attr("x", 20)
  .attr("y", 100)
  .text("Close");
const close_text = svg
  .append("text")
  .attr("class", "value close")
  .attr("x", 115)
  .attr("y", 100)
  .text("");

// change
svg
  .append("text")
  .attr("class", "value-section")
  .attr("x", 20)
  .attr("y", 120)
  .text("change");
const change_text = svg
  .append("text")
  .attr("class", "value change")
  .attr("x", 115)
  .attr("y", 120)
  .text("");

// change percent
svg
  .append("text")
  .attr("class", "value-section")
  .attr("x", 20)
  .attr("y", 140)
  .text("change(%)");
const percentChange_text = svg
  .append("text")
  .attr("class", "value percentChange")
  .attr("x", 115)
  .attr("y", 140)
  .text("");


// Volume
svg
  .append("text")
  .attr("class", "value-section")
  .attr("x", 20)
  .attr("y", 160)
  .text("Volume");
const volume_text = svg
  .append("text")
  .attr("class", "value volume")
  .attr("x", 115)
  .attr("y", 160)
  .text("");

//設定當移動的時候要顯示的文字
function move(coords, index) {
  let datas = localStorage.getItem("home");
  let data = JSON.parse(datas);

  var i;
  for (i = 0; i < data.length; i++) {
    if (coords.x.toString() === new Date(data[i].date).toString()) {
      let day = new Date(coords.x);
      console.log(day);
      let y = day.getFullYear();
      let m = day.getMonth() + 1;
      let d = day.getDate();
      corp_text.text(data[0].name)
      date_text.text(y + '/' + m + '/' + d)
      open_text.text(data[i].open)
      high_text.text(data[i].high)
      low_text.text(data[i].low)
      close_text.text(data[i].close)
      change_text.text(data[i].change)
      percentChange_text.text(data[i].percentChange)
      volume_text.text(data[i].volume);
    }
  }
}

function reset() {
  zoom.scale(1);
  zoom.translate([0, 0]);
  draw();
}

function zoomed() {
  x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
  y.domain(d3.event.transform.rescaleY(yInit).domain());
  yPercent.domain(d3.event.transform.rescaleY(yPercentInit).domain());

  draw();
}

function draw() {
  svg.select("g.x.axis").call(xAxis);
  svg.select("g.ohlc .axis").call(yAxis);
  svg.select("g.volume.axis").call(volumeAxis);
  svg.select("g.percent.axis").call(percentAxis);
  svg.select("g.macd .axis.right").call(macdAxis);
  svg.select("g.rsi .axis.right").call(rsiAxis);
  svg.select("g.macd .axis.left").call(macdAxisLeft);
  svg.select("g.rsi .axis.left").call(rsiAxisLeft);

  // We know the data does not change, a simple refresh that does not perform data joins will suffice.
  svg.select("g.candlestick").call(candlestick.refresh);
  svg.select("g.close").call(close.refresh);
  svg.select("g.close.annotation").call(closeAnnotation.refresh);
  svg.select("g.volume").call(volume.refresh);
  svg.select("g .sma.ma-0").call(sma0.refresh);
  svg.select("g .sma.ma-1").call(sma1.refresh);
  svg.select("g .ema.ma-2").call(ema2.refresh);
  svg.select("g.macd .indicator-plot").call(macd.refresh);
  svg.select("g.rsi .indicator-plot").call(rsi.refresh);
  svg.select("g.crosshair.ohlc").call(ohlcCrosshair.refresh);
  svg.select("g.crosshair.macd").call(macdCrosshair.refresh);
  svg.select("g.crosshair.rsi").call(rsiCrosshair.refresh);
  svg.select("g.trendlines").call(trendline.refresh);
  svg.select("g.supstances").call(supstance.refresh);
  svg.select("g.tradearrow").call(tradearrow.refresh);
}

// GET DATA
function getData() {
  let code = $(".search").val();
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
      for (let i = 0; i < body.data.length; i++) {
        let strDate = body.data[i].date.toString();
        let y = strDate[0] + strDate[1] + strDate[2] + strDate[3] + "/";
        let m = strDate[4] + strDate[5] + "/";
        let d = strDate[6] + strDate[7];
        body.data[i].date = new Date(y + m + d);
      }
      let datas = JSON.stringify(body.data);
      localStorage.setItem("home", datas);
      renderData(body.data);
    });
}

function option() {
  window.location.replace("../option.html");
}
function backTest() {
  window.location.replace("../backTest.html");
}
function kBar() { }
function line() { }
function finance() { }
function news() { }
function information() { }

getData();
