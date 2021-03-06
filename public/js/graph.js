/* global $, techan, d3 */

const app = {
  indicatorPreRoll : 33,
  currd3Graph : null,
};

app.d3init = async function (data) {
  const dim = { // graph arena
    width: 930,
    height: 750, // bottom x axis
    margin: { top: 50, right: 60, bottom: 50, left: 60 },
    ohlc: { height: 405 },
    indicator: { height: 90, padding: 20 }, // adjust the second layer
  };
  dim.plot = { // inside graph
    width: dim.width - dim.margin.left - dim.margin.right,
    height: dim.height - dim.margin.top - dim.margin.bottom,
  }; // adjust the second layer
  dim.indicator.top = dim.ohlc.height + dim.indicator.padding; // + open - close
  dim.indicator.bottom =
    dim.indicator.top + dim.indicator.height + dim.indicator.padding; // + open - close

  const indicatorTop = d3
    .scaleLinear()
    .range([dim.indicator.top, dim.indicator.bottom]);

  const parseDate = d3.timeParse('%Y%m%d');

  const x = techan.scale.financetime().range([0, dim.plot.width]); // k bar graph x axis

  const y = d3.scaleLinear().range([dim.ohlc.height, 0]); // k bar graph y axis

  const yPercent = y.copy(); // Same as y at this stage, will get a different domain later

  let yInit, yPercentInit, zoomableInit;

  const yVolume = d3.scaleLinear().range([y(0), y(0.2)]); // volume y

  const candlestick = techan.plot.candlestick().xScale(x).yScale(y); //k bar

  const close = techan.plot.close().xScale(x).yScale(y);  //close

  const tradearrow = techan.plot
    .tradearrow()
    .xScale(x)
    .yScale(y)
    .y(function (d) { // Display the buy and sell arrows a bit above and below the price, so the price is still visible
      if (d.type === 'buy') return y(d.low) + 5;
      if (d.type === 'sell') return y(d.high) - 5;
      else return y(d.price);
    });

  const sma0 = techan.plot.sma().xScale(x).yScale(y);

  const sma1 = techan.plot.sma().xScale(x).yScale(y);

  const ema2 = techan.plot.ema().xScale(x).yScale(y);

  const volume = techan.plot
    .volume()
    .accessor(close.accessor())
    .xScale(x)
    .yScale(yVolume);

  const trendline = techan.plot.trendline().xScale(x).yScale(y);

  const supstance = techan.plot.supstance().xScale(x).yScale(y);

  const xAxis = d3.axisBottom(x);

  // setting crosschair display time
  const timeAnnotation = techan.plot // bottom x axis time
    .axisannotation()
    .axis(xAxis)
    .orient('bottom')
    .format(d3.timeFormat('%Y-%m-%d'))
    .width(90)
    .height(20)
    .translate([0, dim.plot.height]); //rect coordinate

  const yAxis = d3.axisRight(y); // y coordinate of close for right

  // tag of right for mouse
  const ohlcAnnotation = techan.plot
    .axisannotation()
    .axis(yAxis)
    .orient('right') // tag of right
    .format(d3.format(',.2f')) // number of position for float number
    .translate([x(1), 0]) //rect coordinate
    .width(60)
    .height(20);

  // last close tag on right axis
  const closeAnnotation = techan.plot
    .axisannotation()
    .axis(yAxis)
    .orient('right')
    .accessor(close.accessor())
    .format(d3.format(',.2f'))
    .translate([x(1), 0])
    .width(60)
    .height(20);

  const percentAxis = d3
    .axisLeft(yPercent) // tag % of left for mouse
    .tickFormat(d3.format('+.1%')); //base on f, return 100 and add %

  const percentAnnotation = techan.plot
    .axisannotation()
    .axis(percentAxis)
    .orient('left') // tag % of left for mouse
    .width(60)
    .height(20);

  // last close tag on left axis
  const volumeAxis = d3
    .axisRight(yVolume)
    .ticks(3) // gap of volume axis
    .tickFormat(d3.format(',.3s')); // base on r, and include unit

 // last volume tag on left axis
  const volumeAnnotation = techan.plot
    .axisannotation()
    .axis(volumeAxis)
    .orient('right')
    .width(50)
    .height(20);

  // ------------------- macd ------------------

  const macdScale = d3
    .scaleLinear()
    .range([indicatorTop(0) + dim.indicator.height, indicatorTop(0)]);

  const macd = techan.plot.macd().xScale(x).yScale(macdScale);

  const macdAxis = d3.axisRight(macdScale).ticks(3); // macd gap of right

  const macdAnnotation = techan.plot
    .axisannotation()
    .axis(macdAxis)
    .orient('right')
    .format(d3.format(',.2f'))
    .translate([x(1), 0])
    .width(60)
    .height(20);

  const macdAxisLeft = d3.axisLeft(macdScale).ticks(3);

  const macdAnnotationLeft = techan.plot
    .axisannotation()
    .axis(macdAxisLeft)
    .orient('left')
    .format(d3.format(',.2f'))
    .width(60)
    .height(20);

  // ------------------- ris ------------------

  const rsiScale = macdScale
    .copy()
    .range([indicatorTop(1) + dim.indicator.height, indicatorTop(1)]);

  const rsi = techan.plot.rsi().xScale(x).yScale(rsiScale);

  const rsiAxis = d3.axisRight(rsiScale).ticks(3);

  const rsiAnnotation = techan.plot
    .axisannotation()
    .axis(rsiAxis)
    .orient('right')
    .format(d3.format(',.2f'))
    .translate([x(1), 0])
    .width(60)
    .height(20);

  const rsiAxisLeft = d3.axisLeft(rsiScale).ticks(3);

  const rsiAnnotationLeft = techan.plot
    .axisannotation()
    .axis(rsiAxisLeft)
    .orient('left')
    .format(d3.format(',.2f'))
    .width(60)
    .height(20);

  const macdCrosshair = techan.plot
    .crosshair()
    .xScale(timeAnnotation.axis().scale())
    .yScale(macdAnnotation.axis().scale())
    .xAnnotation(timeAnnotation)
    .yAnnotation([macdAnnotation, macdAnnotationLeft])
    .verticalWireRange([0, dim.plot.height]);

  const rsiCrosshair = techan.plot
    .crosshair()
    .xScale(timeAnnotation.axis().scale())
    .yScale(rsiAnnotation.axis().scale())
    .xAnnotation(timeAnnotation)
    .yAnnotation([rsiAnnotation, rsiAnnotationLeft])
    .verticalWireRange([0, dim.plot.height]);

  const a = $('<div>').attr('class', 'graphlayout');
  $('#select').append(a);

  let svg = d3
    .select('.graphlayout')
    .append('svg')
    .attr('width', dim.width)
    .attr('height', dim.height);

  const defs = svg.append('defs');

  defs
    .append('clipPath')
    .attr('id', 'ohlcClip')
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', dim.plot.width)
    .attr('height', dim.ohlc.height);

  defs
    .selectAll('indicatorClip')
    .data([0, 1])
    .enter()
    .append('clipPath')
    .attr('id', function (d, i) {
      return 'indicatorClip-' + i;
    })
    .append('rect')
    .attr('x', 0)
    .attr('y', function (d, i) {
      return indicatorTop(i);
    })
    .attr('width', dim.plot.width)
    .attr('height', dim.indicator.height);

  svg = svg
    .append('g')
    .attr(
      'transform',
      'translate(' + dim.margin.left + ',' + dim.margin.top + ')'
    );

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + dim.plot.height + ')');

  const ohlcSelection = svg
    .append('g')
    .attr('class', 'ohlc')
    .attr('transform', 'translate(0,0)');

  ohlcSelection
    .append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + x(1) + ',0)')
    .append('text')
    .attr('y', -20)
    .attr('x', 55)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Price (NTD)');

  ohlcSelection.append('g').attr('class', 'close annotation up');

  ohlcSelection
    .append('g')
    .attr('class', 'volume')
    .attr('clip-path', 'url(#ohlcClip)');

  ohlcSelection
    .append('g')
    .attr('class', 'indicator sma ma-0')
    .attr('clip-path', 'url(#ohlcClip)');

  ohlcSelection
    .append('g')
    .attr('class', 'indicator sma ma-1')
    .attr('clip-path', 'url(#ohlcClip)');

  ohlcSelection
    .append('g')
    .attr('class', 'indicator ema ma-2')
    .attr('clip-path', 'url(#ohlcClip)');

  ohlcSelection.append('g').attr('class', 'percent axis');

  ohlcSelection.append('g').attr('class', 'volume axis');

  const indicatorSelection = svg
    .selectAll('svg > g.indicator')
    .data(['macd', 'rsi'])
    .enter()
    .append('g')
    .attr('class', function (d) {
      return d + ' indicator';
    });

  indicatorSelection
    .append('g')
    .attr('class', 'axis right')
    .attr('transform', 'translate(' + x(1) + ',0)');

  indicatorSelection
    .append('g')
    .attr('class', 'axis left')
    .attr('transform', 'translate(' + x(0) + ',0)');

  indicatorSelection
    .append('g')
    .attr('class', 'indicator-plot')
    .attr('clip-path', function (d, i) {
      return 'url(#indicatorClip-' + i + ')';
    });

  // Add trendlines and other interactions last to be above zoom pane
  svg.append('g').attr('class', 'crosshair ohlc');

  svg
    .append('g')
    .attr('class', 'tradearrow')
    .attr('clip-path', 'url(#ohlcClip)');

  svg.append('g').attr('class', 'crosshair macd');

  svg.append('g').attr('class', 'crosshair rsi');

  svg
    .append('g')
    .attr('class', 'trendlines analysis')
    .attr('clip-path', 'url(#ohlcClip)');

  svg
    .append('g')
    .attr('class', 'supstances analysis')
    .attr('clip-path', 'url(#ohlcClip)');

  svg
    .append('rect')
    .attr('class', 'symbols')
    .attr('x', 16)
    .attr('y', 2)
    .attr('width', '155')
    .attr('height', '165')
    .attr('opacity', 0.15);

  // corp name
  svg.append('text').attr('class', 'symbols');

  const corp_text = svg
    .append('text')
    .attr('class', 'value corp')
    .attr('x', 20)
    .attr('y', 20)
    .text('');

  const date_text = svg
    .append('text')
    .attr('class', 'value date_text')
    .attr('x', 95)
    .attr('y', 20)
    .text('');

  // Open
  svg
    .append('text')
    .attr('class', 'value open')
    .attr('x', 20)
    .attr('y', 40)
    .text('Open');
  const open_text = svg
    .append('text')
    .attr('class', 'value open')
    .attr('x', 95)
    .attr('y', 40)
    .text('');

  // High
  svg
    .append('text')
    .attr('class', 'value high')
    .attr('x', 20)
    .attr('y', 60)
    .text('High');
  const high_text = svg
    .append('text')
    .attr('class', 'value high')
    .attr('x', 95)
    .attr('y', 60)
    .text('');

  // Low
  svg
    .append('text')
    .attr('class', 'value low')
    .attr('x', 20)
    .attr('y', 80)
    .text('Low');
  const low_text = svg
    .append('text')
    .attr('class', 'value low')
    .attr('x', 95)
    .attr('y', 80)
    .text('');

  // Close
  svg
    .append('text')
    .attr('class', 'value close')
    .attr('x', 20)
    .attr('y', 100)
    .text('Close');
  const close_text = svg
    .append('text')
    .attr('class', 'value close')
    .attr('x', 95)
    .attr('y', 100)
    .text('');

  // change
  svg
    .append('text')
    .attr('class', 'value changes')
    .attr('x', 20)
    .attr('y', 120)
    .text('change');
  const change_text = svg
    .append('text')
    .attr('class', 'value changes')
    .attr('x', 95)
    .attr('y', 120)
    .text('');

  // change percent
  svg
    .append('text')
    .attr('class', 'value percentChange')
    .attr('x', 20)
    .attr('y', 140)
    .text('change(%)');
  const percentChange_text = svg
    .append('text')
    .attr('class', 'value percentChange')
    .attr('x', 95)
    .attr('y', 140)
    .text('');

  // Volume
  svg
    .append('text')
    .attr('class', 'value volume')
    .attr('x', 20)
    .attr('y', 160)
    .text('Volume');
  const volume_text = svg
    .append('text')
    .attr('class', 'value volume')
    .attr('x', 95)
    .attr('y', 160)
    .text('');

  const ohlcCrosshair = techan.plot
    .crosshair()
    .xScale(timeAnnotation.axis().scale())
    .yScale(ohlcAnnotation.axis().scale())
    .xAnnotation(timeAnnotation)
    .yAnnotation([ohlcAnnotation, percentAnnotation, volumeAnnotation])
    .verticalWireRange([0, dim.plot.height])
    .on('move', (coords) => {

      let i;
      for (i = 0; i < data.length; i++) {
        if (coords.x.toString() === new Date(data[i].date).toString()) {
          const day = new Date(coords.x);
          const y = day.getFullYear();
          const m = day.getMonth() + 1;
          const d = day.getDate();
          corp_text.text(data[0].name);
          date_text.text(y + '/' + m + '/' + d);
          open_text.text(data[i].open);
          high_text.text(data[i].high);
          low_text.text(data[i].low);
          close_text.text(data[i].close);
          change_text.text(data[i].change);
          percentChange_text.text(data[i].percentChange);
          volume_text.text(data[i].volume);
        }
      }
    });


  const d3data = {
    dim: dim,
    parseDate: parseDate,
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
};

app.zoom = (d3Graph)=>{
  return d3
  .zoom()
  .scaleExtent([1, 5]) //setting zoom-in 1~5
  .translateExtent([
    [0, 0],
    [d3Graph.dim.plot.width, d3Graph.dim.plot.height],
  ]) // limit zoom-in area
  .extent([
    [d3Graph.dim.margin.left, d3Graph.dim.margin.top],
    [d3Graph.dim.plot.width, d3Graph.dim.plot.height],
  ])
  .on('zoom', () => {

    d3Graph.x.zoomable().domain(d3.event.transform.rescaleX(d3Graph.zoomableInit).domain());
    d3Graph.y.domain(d3.event.transform.rescaleY(d3Graph.yInit).domain());
    d3Graph.yPercent.domain(d3.event.transform.rescaleY(d3Graph.yPercentInit).domain());
    app.draw(d3Graph);
  });
};

app.draw = function (d3Graph) {
  d3Graph.svg.select('g.x.axis').call(d3Graph.xAxis);
  d3Graph.svg.select('g.ohlc .axis').call(d3Graph.yAxis);
  d3Graph.svg.select('g.percent.axis').call(d3Graph.percentAxis);
  d3Graph.svg.select('g.macd .axis.right').call(d3Graph.macdAxis);
  d3Graph.svg.select('g.rsi .axis.right').call(d3Graph.rsiAxis);
  d3Graph.svg.select('g.macd .axis.left').call(d3Graph.macdAxisLeft);
  d3Graph.svg.select('g.rsi .axis.left').call(d3Graph.rsiAxisLeft);

  // We know the data does not change, a simple refresh that does not perform data joins will suffice.
  d3Graph.svg.select('g.candlestick').call(d3Graph.candlestick.refresh);
  d3Graph.svg.selectAll('g.close').call(d3Graph.close.refresh);
  d3Graph.svg.select('g.close.annotation').call(d3Graph.closeAnnotation.refresh);
  d3Graph.svg.select('g.volume').call(d3Graph.volume.refresh);
  d3Graph.svg.select('g .sma.ma-0').call(d3Graph.sma0.refresh);
  d3Graph.svg.select('g .sma.ma-1').call(d3Graph.sma1.refresh);
  d3Graph.svg.select('g .ema.ma-2').call(d3Graph.ema2.refresh);
  d3Graph.svg.select('g.macd .indicator-plot').call(d3Graph.macd.refresh);
  d3Graph.svg.select('g.rsi .indicator-plot').call(d3Graph.rsi.refresh);
  d3Graph.svg.select('g.crosshair.ohlc').call(d3Graph.ohlcCrosshair.refresh);
  d3Graph.svg.select('g.crosshair.macd').call(d3Graph.macdCrosshair.refresh);
  d3Graph.svg.select('g.crosshair.rsi').call(d3Graph.rsiCrosshair.refresh);
  d3Graph.svg.select('g.trendlines').call(d3Graph.trendline.refresh);
  d3Graph.svg.select('g.supstances').call(d3Graph.supstance.refresh);
  d3Graph.svg.select('g.tradearrow').call(d3Graph.tradearrow.refresh);
};

app.smaAndema = function (d3Graph, graphData) {

  const data = [];
  for (let i = 0; i < graphData.length; i++) {
    const oldDate = graphData[i].date;
    graphData[i].date = new Date(oldDate);
    data.push(graphData[i]);
  }

  d3Graph.ohlcSelection
    .append('g')
    .attr('class', 'indicator sma ma-0')
    .attr('clip-path', 'url(#ohlcClip)');

  d3Graph.ohlcSelection
    .append('g')
    .attr('class', 'indicator sma ma-1')
    .attr('clip-path', 'url(#ohlcClip)');

  d3Graph.ohlcSelection
    .append('g')
    .attr('class', 'indicator ema ma-2')
    .attr('clip-path', 'url(#ohlcClip)');

  d3Graph.svg
    .select('g.sma.ma-0')
    .datum(techan.indicator.sma().period(10)(data))
    .call(d3Graph.sma0);
  d3Graph.svg
    .select('g.sma.ma-1')
    .datum(techan.indicator.sma().period(20)(data))
    .call(d3Graph.sma1);
  d3Graph.svg
    .select('g.ema.ma-2')
    .datum(techan.indicator.ema().period(50)(data))
    .call(d3Graph.ema2);
};

app.smaCancel = function (d3Graph) {
  d3.select('.indicator').remove();
  d3.select('.indicator').remove();
  d3.select('.indicator').remove();

  d3Graph.ohlcSelection
    .append('g')
    .attr('class', 'indicator sma ma-0')
    .attr('clip-path', 'url(#ohlcClip)');

  d3Graph.ohlcSelection
    .append('g')
    .attr('class', 'indicator sma ma-1')
    .attr('clip-path', 'url(#ohlcClip)');

  d3Graph.ohlcSelection
    .append('g')
    .attr('class', 'indicator ema ma-2')
    .attr('clip-path', 'url(#ohlcClip)');
};

app.volumeCancel = function (d3Graph) {
  d3.select('.volume').remove();
  d3.select('.volume.axis').remove();

  d3Graph.ohlcSelection
    .append('g')
    .attr('class', 'volume')
    .attr('clip-path', 'url(#ohlcClip)');

  d3Graph.ohlcSelection.append('g').attr('class', 'volume axis');
};

app.volumeRender = function (d3Graph, graphData) {

  const data = [];
  for (let i = 0; i < graphData.length; i++) {
    const oldDate = graphData[i].date;
    graphData[i].date = new Date(oldDate);
    data.push(graphData[i]);
  }
  d3Graph.ohlcSelection
    .append('g')
    .attr('class', 'volume')
    .attr('clip-path', 'url(#ohlcClip)');

  d3Graph.yVolume.domain(techan.scale.plot.volume(data).domain());
  d3Graph.svg.select('g.volume').datum(data).call(d3Graph.volume);

  d3Graph.svg.select('g.volume.axis').call(d3Graph.volumeAxis);
  d3Graph.svg.select('g.volume').call(d3Graph.volume.refresh);
};

app.kBarSetting = function (d3Graph, data) {
  d3Graph.ohlcSelection
    .append('g')
    .attr('class', 'candlestick')
    .attr('clip-path', 'url(#ohlcClip)');

  const accessor = d3Graph.candlestick.accessor();
  // Don't show where indicators don't have data
  // let accessor = close.accessor(),
  // indicatorPreRoll = 33; // Don't show where indicators don't have data

  d3Graph.x.domain(techan.scale.plot.time(data).domain());
  d3Graph.y.domain(techan.scale.plot.ohlc(data.slice(app.indicatorPreRoll)).domain());
  d3Graph.yPercent.domain(
    techan.scale.plot.percent(d3Graph.y, accessor(data[app.indicatorPreRoll])).domain()
  );

  const macdData = techan.indicator.macd()(data);
  d3Graph.macdScale.domain(techan.scale.plot.macd(macdData).domain());
  const rsiData = techan.indicator.rsi()(data);
  d3Graph.rsiScale.domain(techan.scale.plot.rsi(rsiData).domain());

  d3Graph.svg.select('g.candlestick').datum(data).call(d3Graph.candlestick);

  d3Graph.svg.select('g.macd .indicator-plot').datum(macdData).call(d3Graph.macd);
  d3Graph.svg.select('g.rsi .indicator-plot').datum(rsiData).call(d3Graph.rsi);

  d3Graph.svg.select('g.crosshair.ohlc').call(d3Graph.ohlcCrosshair).call(app.zoom(d3Graph));
  d3Graph.svg.select('g.crosshair.macd').call(d3Graph.macdCrosshair).call(app.zoom(d3Graph));
  d3Graph.svg.select('g.crosshair.rsi').call(d3Graph.rsiCrosshair).call(app.zoom(d3Graph));
  // Stash for zooming
  d3Graph.zoomableInit = d3Graph.x.zoomable().domain([app.indicatorPreRoll, data.length]).copy(); // Zoom in a little to hide indicator preroll
  d3Graph.yInit = d3Graph.y.copy();
  d3Graph.yPercentInit = d3Graph.yPercent.copy();
};

app.closeSetting = function (d3Graph, data) {
  d3Graph.ohlcSelection
    .append('g')
    .attr('class', 'close')
    .attr('clip-path', 'url(#ohlcClip)');

  const accessor = d3Graph.close.accessor();
    // indicatorPreRoll = 33; // Don't show where indicators don't have data

  d3Graph.x.domain(techan.scale.plot.time(data).domain());
  d3Graph.y.domain(techan.scale.plot.ohlc(data.slice(app.indicatorPreRoll)).domain());
  d3Graph.yPercent.domain(
    techan.scale.plot.percent(d3Graph.y, accessor(data[app.indicatorPreRoll])).domain()
  );

  const macdData = techan.indicator.macd()(data);
  d3Graph.macdScale.domain(techan.scale.plot.macd(macdData).domain());
  const rsiData = techan.indicator.rsi()(data);
  d3Graph.rsiScale.domain(techan.scale.plot.rsi(rsiData).domain());

  d3Graph.svg.selectAll('g.close').datum(data).call(d3Graph.close);

  d3Graph.svg.select('g.macd .indicator-plot').datum(macdData).call(d3Graph.macd);
  d3Graph.svg.select('g.rsi .indicator-plot').datum(rsiData).call(d3Graph.rsi);

  d3Graph.svg.select('g.crosshair.ohlc').call(d3Graph.ohlcCrosshair).call(app.zoom(d3Graph));
  d3Graph.svg.select('g.crosshair.macd').call(d3Graph.macdCrosshair).call(app.zoom(d3Graph));
  d3Graph.svg.select('g.crosshair.rsi').call(d3Graph.rsiCrosshair).call(app.zoom(d3Graph));
  // Stash for zooming
  d3Graph.zoomableInit = d3Graph.x.zoomable().domain([app.indicatorPreRoll, data.length]).copy(); // Zoom in a little to hide indicator preroll
  d3Graph.yInit = d3Graph.y.copy();
  d3Graph.yPercentInit = d3Graph.yPercent.copy();
};

app.trendSetting = function (d3Graph, data) {
  d3Graph.svg
    .select('g.trendlines')
    .datum(data)
    .call(d3Graph.trendline)
    .call(d3Graph.trendline.drag);
};

app.trendDataSort = function (trendData) {
  const trend = [];
  for (let i = 0; i < trendData.length; i++) {
    const startOldDates = trendData[i].startDate.toString();
    const endOldDates = trendData[i].endDate.toString();
    const startDate =
      startOldDates[0] +
      startOldDates[1] +
      startOldDates[2] +
      startOldDates[3] +
      '/' +
      startOldDates[4] +
      startOldDates[5] +
      '/' +
      startOldDates[6] +
      startOldDates[7];
    const endDate =
      endOldDates[0] +
      endOldDates[1] +
      endOldDates[2] +
      endOldDates[3] +
      '/' +
      endOldDates[4] +
      endOldDates[5] +
      '/' +
      endOldDates[6] +
      endOldDates[7];
    const trendObj = {};
    trendObj.startDate = new Date(startDate);
    trendObj.endDate = new Date(endDate);
    trendObj.startPrice = trendData[i].startPrice;
    trendObj.endPrice = trendData[i].endPrice;

    trend.push(trendObj);
  }

  const trendlineData = [];
  for (let i = 0; i < trend.length; i++) {
    const index = {
      start: {
        date: trend[i].startDate,
        value: trend[i].startPrice,
      },
      end: {
        date: trend[i].endDate,
        value: trend[i].endPrice,
      },
    };
    trendlineData.push(index);
  }
  return trendlineData;
};


app.checkVolume = function checkVolume() {
  if ($('.volumes').is(':checked') === true) {
    app.volumeRender(app.currGraph, app.choiceStockData);
  } else {
    app.volumeCancel(app.currGraph, app.choiceStockData);
  }
};

app.checkMA = function checkMA() {
  if ($('.ma').is(':checked') === true) {
    app.smaAndema(app.currGraph, app.choiceStockData);
  } else {
    app.smaCancel(app.currGraph, app.choiceStockData);
  }
};

app.indicate = function indicate() {
  const display = $('.indicate').css('display');
  if (display === 'none') {
    $('.indicate').css('display', 'block');
  } else {
    $('.indicate').css('display', 'none');
  }
};