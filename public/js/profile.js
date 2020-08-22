/* global  $ Swal app d3*/
app.filterHistoryData = null;
app.choiceStockTrend = null;
app.choiceStockData = null;
app.backTestHistoryData = null;

app.fetchPostData = async function (url, data) {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  return res.json();
};

app.fetchGetData = async function (url) {
  const res = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('userToken'),
    }),
  });
  return res.json();
};

// nav function
app.getData = async function () {
  if ($('.search').val() !== '') {
    window.location.replace(`/basic.html?stock=${$('.search').val()}`);
  }
};

$('.search').on('keypress', function (e) {
  if (e.key === 'Enter') {
    app.getData();
  }
});

// render graph
app.renderInfor = function (data) {
  $('.name').remove();
  $('.price').remove();
  $('.change').remove();
  const len = data.length;
  const infor = data[len - 1];
  const name = $('<div>')
    .attr('class', 'stockName')
    .append(`${infor.name}(${infor.code}.TW)`);
  const price = $('<div>')
    .attr('class', 'price')
    .append(`${infor.close}`)
    .css('color', '#ffffff');
  const change = $('<div>')
    .attr('class', 'change')
    .append(`${infor.change}` + ' ' + `(${infor.percentChange}%)`);

  if (infor.change[0] !== '-') {
    change.css('color', 'red');
  } else if (infor.change[0] === '0') {
    change.css('color', '#ffffff');
  } else {
    change.css('color', 'green');
  }
  $('.info').append(name).append(price).append(change);
};

app.renderKBar = async function (trendData) {
  d3.select('.graphlayout').remove();
  app.currGraph = null;

  const d3Graph = await app.d3init(app.choiceStockData);

  const datas = app.choiceStockData;

  await app.renderInfor(datas);

  const data = [];
  for (let i = 0; i < datas.length; i++) {
    const oldDate = datas[i].date;
    datas[i].date = new Date(oldDate);
    data.push(datas[i]);
  }
  const trendlineData = await app.trendDataSort(trendData);

  await app.kBarSetting(d3Graph, data);

  await app.trendSetting(d3Graph, trendlineData);

  app.zoom(d3Graph);
  app.draw(d3Graph);
  app.currGraph = d3Graph;
};

app.renderClose = async function (trendData) {
  d3.select('.graphlayout').remove();
  app.currGraph = null;
  const d3Graph = await app.d3init(app.choiceStockData);

  const datas = app.choiceStockData;

  await app.renderInfor(datas);

  const data = [];
  for (let i = 0; i < datas.length; i++) {
    const oldDate = datas[i].date;
    datas[i].date = new Date(oldDate);
    data.push(datas[i]);
  }

  const trendlineData = await app.trendDataSort(trendData);

  await app.closeSetting(d3Graph, data);
  await app.trendSetting(d3Graph, trendlineData);

  app.zoom(d3Graph);
  app.draw(d3Graph);
  app.currGraph = d3Graph;
};

app.renderStock = async function (data) {
  const stockInf = {
    start: app.filterHistoryData[data].start,
    end: app.filterHistoryData[data].end,
    code: app.filterHistoryData[data].stock_code,
  };

  const backTestTrend = JSON.parse(app.filterHistoryData[data].trend);
  app.choiceStockTrend = backTestTrend;

  const url = `api/1.0/stock?code=${stockInf.code}&start=${stockInf.start}&end=${stockInf.end}`;
  const body = await app.fetchGetData(url);

  for (let i = 0; i < body.data.length; i++) {
    const oldDate = body.data[i].date.toString();
    const y = oldDate[0] + oldDate[1] + oldDate[2] + oldDate[3];
    const m = oldDate[4] + oldDate[5];
    const d = oldDate[6] + oldDate[7];
    const newDateString = y + '-' + m + '-' + d;
    const newDate = new Date(newDateString);
    body.data[i].date = newDate;
  }
  app.choiceStockData = body.data;

  app.renderKBar(backTestTrend);
};

app.checkVolume = function () {
  if ($('.volumes').is(':checked') === true) {
    app.volumeRender(app.currGraph, app.choiceStockData);
  } else {
    app.volumeCancel(app.currGraph, app.choiceStockData);
  }
};

app.checkMA = function () {
  if ($('.ma').is(':checked') === true) {
    app.smaAndema(app.currGraph, app.choiceStockData);
  } else {
    app.smaCancel(app.currGraph, app.choiceStockData);
  }
};

app.indicate = function () {
  const display = $('.indicate').css('display');
  if (display === 'none') {
    $('.indicate').css('display', 'block');
  } else {
    $('.indicate').css('display', 'none');
  }
};

// main function

// profile page
app.renderProfile = function () {
  $('#graphView').attr('disabled', false);
  $('#profile').attr('disabled', true);
  $('#TestRecord').attr('disabled', false);

  $('#graphView').css('color', '#656565');
  $('#graphView').css('border-bottom-color', '#656565');
  $('#profile').css('color', '#ffffff');
  $('#profile').css('border-bottom-color', '#ffffff');
  $('#TestRecord').css('color', '#656565');
  $('#TestRecord').css('border-bottom-color', '#656565');

  $('.context').show();
  $('.filter').hide();
  $('.resultTable').hide();
  $('.graphOption').hide();
  $('.info_block').hide();
  $('.filter').hide();
  $('.graphOption').hide();
  $('#select').hide();
  $('.profile').show();
  $('.backTest').hide();
  $('.graphOptionFilter').hide();
};

// filter page
app.renderGraphRecord = async function () {
  $('.context').hide();
  $('.filter').show();
  $('.resultTable').show();
  $('.graphOption').show();
  $('.info_block').show();

  $('#graphView').attr('disabled', true);
  $('#profile').attr('disabled', false);
  $('#TestRecord').attr('disabled', false);

  $('#graphView').css('color', '#ffffff');
  $('#graphView').css('border-bottom-color', '#ffffff');
  $('#profile').css('color', '#656565');
  $('#profile').css('border-bottom-color', '#656565');
  $('#TestRecord').css('color', '#656565');
  $('#TestRecord').css('border-bottom-color', '#656565');

  $('.userOptionFilter').show();
  $('.graphOptionFilter').show();
  $('#select').show();
  $('.inforFilter').show();
  $('.profile').hide();
  $('.backTest').hide();

  if ($('#userOptionFilter').children().length > 0) {
    return;
  }

  const url = 'api/1.0/user/graphView';
  const body = await app.fetchGetData(url);
  app.filterHistoryData = body;
  for (let i = 0; i < body.length; i++) {
    // user search condition
    var tr = $('<tr>').attr('class', 'userOptionFilter').append(
      $('<td>').attr('class', 'userChoice').click(function () { `${app.renderStock(i)}`; }).append('#' + (i + 1)),
      $('<td>').attr('class', 'userChoice').click(function () { `${app.renderStock(i)}`; }).append(body[i].stock_code),
      $('<td>').attr('class', 'userChoice').click(function () { `${app.renderStock(i)}`; }).append(body[i].name),
      $('<td>').attr('class', 'userChoice').click(function () { `${app.renderStock(i)}`; }).append(body[i].start),
      $('<td>').attr('class', 'userChoice').click(function () { `${app.renderStock(i)}`; }).append(body[i].end),
      $('<td>').attr('class', 'userChoice').click(function () { `${app.renderStock(i)}`; }).append(body[i].upper),
      $('<td>').attr('class', 'userChoice').click(function () { `${app.renderStock(i)}`; }).append(body[i].lower),
      $('<td>').attr('class', 'userChoice').click(function () { `${app.renderStock(i)}`; }).append(body[i].graph),
      $('<td>').attr('class', 'userChoice').click(function () { `${app.renderStock(i)}`; }).append(body[i].count),
      $('<td>').attr('class', 'userChoice').click(function () { `${app.renderStock(i)}`; }).append(body[i].increase),
      $('<td>').attr('class', 'userChoice').click(function () { `${app.renderStock(i)}`; }).append(body[i].decrease),
    );
    $('#userOptionFilter').append(tr);
  }
  app.renderStock(0);
};

app.choiceStock = async function (data) {
  const stockInf = {
    start: app.filterHistoryData[data].start,
    end: app.filterHistoryData[data].end,
    code: app.filterHistoryData[data].stock_code,
  };

  const backTestTrend = JSON.parse(app.filterHistoryData[data].trend);
  app.choiceStockTrend = backTestTrend;

  const url = `api/1.0/stock?code=${stockInf.code}&start=${stockInf.start}&end=${stockInf.end}`;
  const body = await app.fetchGetData(url);

  for (let i = 0; i < body.data.length; i++) {
    const oldDate = body.data[i].date.toString();
    const y = oldDate[0] + oldDate[1] + oldDate[2] + oldDate[3];
    const m = oldDate[4] + oldDate[5];
    const d = oldDate[6] + oldDate[7];
    const newDateString = y + '-' + m + '-' + d;
    const newDate = new Date(newDateString);
    body.data[i].date = newDate;
  }
  app.choiceStockData = body.data;

  app.renderKBar(backTestTrend);
};

// back test page
app.renderBackTestRecord = async function () {
  $('#graphView').attr('disabled', false);
  $('#profile').attr('disabled', false);
  $('#TestRecord').attr('disabled', true);

  $('#graphView').css('color', '#656565');
  $('#graphView').css('border-bottom-color', '#656565');
  $('#profile').css('color', '#656565');
  $('#profile').css('border-bottom-color', '#656565');
  $('#TestRecord').css('color', '#ffffff');
  $('#TestRecord').css('border-bottom-color', '#ffffff');

  $('.userOptionFilter').hide();
  $('#select').hide();
  $('.inforFilter').hide();
  $('.profile').hide();
  $('.backTest').show();
  $('.graphOptionFilter').hide();
  $('svg').hide();

  $('.context').hide();
  $('.filter').show();
  $('.resultTable').show();
  $('.graphOption').show();
  $('.info_block').show();

  if ($('#userOption').children().length > 0) {
    return;
  }

  const url = 'api/1.0/user/backTestView';
  const body = await app.fetchGetData(url);
  for (let i = 0; i < body.length; i++) {
    // user search condition
    var tr = $('<tr>').attr('class', 'userOption').append(
      $('<td>').attr('class', 'userChoice').append('#' + (i + 1)),
      $('<td>').attr('class', 'userChoice').append(body[i].stock_code),
      $('<td>').attr('class', 'userChoice').append(body[i].name),
      $('<td>').attr('class', 'userChoice').append(body[i].property),
      $('<td>').attr('class', 'userChoice').append(body[i].discount),
      $('<td>').attr('class', 'userChoice').append(body[i].start),
      $('<td>').attr('class', 'userChoice').append(body[i].end),
      $('<td>').attr('class', 'userChoice').append(body[i].decrease),
      $('<td>').attr('class', 'userChoice').append(body[i].decrease_action),
      $('<td>').attr('class', 'userChoice').append(body[i].decrease_count),
      $('<td>').attr('class', 'userChoice').append(body[i].increase),
      $('<td>').attr('class', 'userChoice').append(body[i].increase_action),
      $('<td>').attr('class', 'userChoice').append(body[i].increase_count),
      $('<td>').attr('class', 'userChoice').append(body[i].stock_inventory),
      $('<td>').attr('class', 'userChoice').append(body[i].stock_price),
      $('<td>').attr('class', 'userChoice').append(body[i].trade_cost),
      $('<td>').attr('class', 'userChoice').append(body[i].final_property),
      $('<td>').attr('class', 'userChoice').append(body[i].profit),
      $('<td>').attr('class', 'userChoice').append(body[i].roi),
    );
    $('#userOption').append(tr);
  }


};

// init function
app.checkUser = async function () {
  if (window.localStorage.getItem('userToken')) {
    const data = {
      token: window.localStorage.getItem('userToken'),
    };
    const url = 'api/1.0/user/profile';
    const body = await app.fetchPostData(url, data);

    if (body.error) {
      const result = await Swal.fire({
        title: '登入逾時，請重新登入',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '好哦!',
        cancelButtonText: '不要!',
        reverseButtons: true,
        allowOutsideClick: false,
      });
      if (result.value) {
        window.location.replace('../signin.html');
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        window.location.replace('../index.html');
      }
    } else {
      $('.memberLink').attr('href', './profile.html');
      $('.member').text(`${body.name}`);
      $('.name').text(`${body.name}`);
      $('.email').text(`${body.email}`);
    }

  } else {
    const result = await Swal.fire({
      title: '請登入會員，激活此功能',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '好哦!',
      cancelButtonText: '不要!',
      reverseButtons: true,
      allowOutsideClick: false,
    });
    if (result.value) {
      window.location.replace('../signin.html');
    } else {
      window.location.replace('../index.html');
    }
  }
};

$('.chart').change(function () {
  var t = $(this).val();
  if (t === 'candle') {
    app.renderKBar(app.choiceStockTrend);
  } else if (t === 'line') {
    app.renderClose(app.choiceStockTrend);
  }
});

app.checkUser();

app.renderProfile();