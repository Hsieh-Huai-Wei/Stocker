/* global  $ Swal app d3*/
app.filterHistoryData = null;
app.choiceStockTrend = null;
app.choiceStockData = null;
app.backTestHistoryData = null;

async function fetchPostData(url, data) {
  let res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  return res.json();
}

async function fetchGetData(url) {
  let res = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('userToken'),
    }),
  });
  return res.json();
}

// nav function
async function getData() {
  if ($('.search').val() !== '') {
    window.location.replace(`/basic.html?stock=${$('.search').val()}`);
  }
}

$('.search').on('keypress', function (e) {
  if (e.key === 'Enter') {
    getData();
  }
});

// render graph
function renderInfor(data) {
  $('.name').remove();
  $('.price').remove();
  $('.change').remove();
  let len = data.length;
  let infor = data[len - 1];
  let name = $('<div>')
    .attr('class', 'stockName')
    .append(`${infor.name}(${infor.code}.TW)`);
  let price = $('<div>')
    .attr('class', 'price')
    .append(`${infor.close}`)
    .css('color', '#ffffff');
  let change = $('<div>')
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
}

async function renderKBar(trendData) {
  d3.select('.graphlayout').remove();
  app.currGraph = null;

  let d3Graph = await app.d3init(app.choiceStockData);

  let datas = app.choiceStockData;

  await renderInfor(datas);

  let data = [];
  for (let i = 0; i < datas.length; i++) {
    let oldDate = datas[i].date;
    datas[i].date = new Date(oldDate);
    data.push(datas[i]);
  }
  let trendlineData = await app.trendDataSort(trendData);

  await app.kBarSetting(d3Graph, data);

  await app.trendSetting(d3Graph, trendlineData);

  app.zoom(d3Graph);
  app.draw(d3Graph);
  app.currGraph = d3Graph;
}

async function renderClose(trendData) {
  d3.select('.graphlayout').remove();
  app.currGraph = null;
  let d3Graph = await app.d3init(app.choiceStockData);

  let datas = app.choiceStockData;

  await renderInfor(datas);

  let data = [];
  for (let i = 0; i < datas.length; i++) {
    let oldDate = datas[i].date;
    datas[i].date = new Date(oldDate);
    data.push(datas[i]);
  }

  let trendlineData = await app.trendDataSort(trendData);

  await app.closeSetting(d3Graph, data);
  await app.trendSetting(d3Graph, trendlineData);

  app.zoom(d3Graph);
  app.draw(d3Graph);
  app.currGraph = d3Graph;
}

async function renderStock(data) {
  let stockInf = {
    start: app.filterHistoryData[data].start,
    end: app.filterHistoryData[data].end,
    code: app.filterHistoryData[data].stock_code,
  };

  let backTestTrend = JSON.parse(app.filterHistoryData[data].trend);
  app.choiceStockTrend = backTestTrend;

  let url = `api/1.0/stock?code=${stockInf.code}&start=${stockInf.start}&end=${stockInf.end}`;
  let body = await fetchGetData(url);

  for (let i = 0; i < body.data.length; i++) {
    let oldDate = body.data[i].date.toString();
    let y = oldDate[0] + oldDate[1] + oldDate[2] + oldDate[3];
    let m = oldDate[4] + oldDate[5];
    let d = oldDate[6] + oldDate[7];
    let newDateString = y + '-' + m + '-' + d;
    let newDate = new Date(newDateString);
    body.data[i].date = newDate;
  }
  app.choiceStockData = body.data;

  renderKBar(backTestTrend);
}

function checkVolume() {
  if ($('.volumes').is(':checked') === true) {
    app.volumeRender(app.currGraph, app.choiceStockData);
  } else {
    app.volumeCancel(app.currGraph, app.choiceStockData);
  }
}

function checkMA() {
  if ($('.ma').is(':checked') === true) {
    app.smaAndema(app.currGraph, app.choiceStockData);
  } else {
    app.smaCancel(app.currGraph, app.choiceStockData);
  }
}

function indicate() {
  let display = $('.indicate').css('display');
  if (display === 'none') {
    $('.indicate').css('display', 'block');
  } else {
    $('.indicate').css('display', 'none');
  }
}

// main function

// profile page
function renderProfile() {
  $('#graphView').attr('disabled', false);
  $('#profile').attr('disabled', true);
  $('#TestRecord').attr('disabled', false);
  $('#overview').css('color', '#656565');
  $('#overview').css('border-bottom-color', '#656565');
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
  // $(".main").remove();

  // let img = $("<img>").attr("src", "./imgs/man.png");
  // let picture = $("<div>").attr("class", "picture").append(img);
  // let information = $("<div>").attr("class", "information");
  // information.append(
  //   $("<div>").attr("class", "item").text("姓名"),
  //   $("<div>").attr("class", "name"),
  //   $("<div>").attr("class", "item").text("信箱"),
  //   $("<div>").attr("class", "email"),
  // );
  // let profile = $("<div>").attr("class", "profile").append(picture).append(information)
  // let main = $("<div>").attr("class", "main").append(profile);

  // $("main").append(main)
}

// filter page
async function renderGraphRecord() {
  $('#graphView').attr('disabled', true);
  $('#profile').attr('disabled', false);
  $('#TestRecord').attr('disabled', false);

  $('#overview').css('color', '#ffffff');
  $('#overview').css('border-bottom-color', '#ffffff');
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


  let url = 'api/1.0/user/graphView';
  let body = await fetchGetData(url);
  app.filterHistoryData = body;
  for (let i = 0; i < body.length; i++) {
    // user search condition
    var tr = $('<tr>').attr('class', 'userOptionFilter').append(
      $('<td>').attr('class', 'userChoice').click(function () { `${renderStock(i)}`; }).append('#' + (i + 1)),
      $('<td>').attr('class', 'userChoice').click(function () { `${renderStock(i)}`; }).append(body[i].stock_code),
      $('<td>').attr('class', 'userChoice').click(function () { `${renderStock(i)}`; }).append(body[i].name),
      $('<td>').attr('class', 'userChoice').click(function () { `${renderStock(i)}`; }).append(body[i].start),
      $('<td>').attr('class', 'userChoice').click(function () { `${renderStock(i)}`; }).append(body[i].end),
      $('<td>').attr('class', 'userChoice').click(function () { `${renderStock(i)}`; }).append(body[i].upper),
      $('<td>').attr('class', 'userChoice').click(function () { `${renderStock(i)}`; }).append(body[i].lower),
      $('<td>').attr('class', 'userChoice').click(function () { `${renderStock(i)}`; }).append(body[i].graph),
      $('<td>').attr('class', 'userChoice').click(function () { `${renderStock(i)}`; }).append(body[i].count),
      $('<td>').attr('class', 'userChoice').click(function () { `${renderStock(i)}`; }).append(body[i].increase),
      $('<td>').attr('class', 'userChoice').click(function () { `${renderStock(i)}`; }).append(body[i].decrease),
    );
    $('#userOptionFilter').append(tr);
  }

  $('.context').hide();
  $('.filter').show();
  $('.resultTable').show();
  $('.graphOption').show();
  $('.info_block').show();
}

async function choiceStock(data) {
  let stockInf = {
    start: app.filterHistoryData[data].start,
    end: app.filterHistoryData[data].end,
    code: app.filterHistoryData[data].stock_code,
  };

  let backTestTrend = JSON.parse(app.filterHistoryData[data].trend);
  app.choiceStockTrend = backTestTrend;

  let url = `api/1.0/stock?code=${stockInf.code}&start=${stockInf.start}&end=${stockInf.end}`;
  let body = await fetchGetData(url);

  for (let i = 0; i < body.data.length; i++) {
    let oldDate = body.data[i].date.toString();
    let y = oldDate[0] + oldDate[1] + oldDate[2] + oldDate[3];
    let m = oldDate[4] + oldDate[5];
    let d = oldDate[6] + oldDate[7];
    let newDateString = y + '-' + m + '-' + d;
    let newDate = new Date(newDateString);
    body.data[i].date = newDate;
  }
  app.choiceStockData = body.data;

  kBarRender(backTestTrend);
}

// back test page
async function renderBackTestRecord() {

  $('#graphView').attr('disabled', false);
  $('#profile').attr('disabled', false);
  $('#TestRecord').attr('disabled', true);


  $('#overview').css('color', '#656565');
  $('#overview').css('border-bottom-color', '#656565');
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

  let url = 'api/1.0/user/backTestView';
  let body = await fetchGetData(url);
  console.log(body);
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
      $('<td>').attr('class', 'userChoice').append(body[i].decreaseAct),
      $('<td>').attr('class', 'userChoice').append(body[i].decreaseCount),
      $('<td>').attr('class', 'userChoice').append(body[i].increase),
      $('<td>').attr('class', 'userChoice').append(body[i].increaseAct),
      $('<td>').attr('class', 'userChoice').append(body[i].increaseCount),
      $('<td>').attr('class', 'userChoice').append(body[i].stock_inventory),
      $('<td>').attr('class', 'userChoice').append(body[i].stock_price),
      $('<td>').attr('class', 'userChoice').append(body[i].trade_cost),
      $('<td>').attr('class', 'userChoice').append(body[i].final_property),
      $('<td>').attr('class', 'userChoice').append(body[i].profit),
      $('<td>').attr('class', 'userChoice').append(body[i].roi),
    );
    $('#userOption').append(tr);
  }

  $('.context').hide();
  $('.filter').show();
  $('.resultTable').show();
  $('.graphOption').show();
  $('.info_block').show();
}

// init function
async function checkUser() {
  if (window.localStorage.getItem('userToken')) {
    const data = {
      token: window.localStorage.getItem('userToken'),
    };
    let url = 'api/1.0/user/profile';
    let body = await fetchPostData(url, data);

    if (body.error) {
      Swal.fire({
        title: '登入逾時，請重新登入',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '好哦!',
        cancelButtonText: '不要!',
        reverseButtons: true,
        allowOutsideClick: false,
      })
        .then((result) => {
          if (result.value) {
            window.location.replace('../signin.html');
          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
            window.location.replace('../index.html');
          }
        });
    } else {
      $('.memberLink').attr('href', './profile.html');
      console.log(body);
      $('.member').text(`${body.name}`);
      $('.name').text(`${body.name}`);
      $('.email').text(`${body.email}`);
    }

  } else {
    Swal.fire({
      title: '請登入會員，激活此功能',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '好哦!',
      cancelButtonText: '不要!',
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value) {
        window.location.replace('../signin.html');
      } else {
        window.location.replace('../index.html');
      }
    });
  }
}

$('.chart').change(function () {
  var t = $(this).val();
  if (t === 'candle') {
    kBarRender(app.choiceStockTrend);
  } else if (t === 'line') {
    closeRender(app.choiceStockTrend);
  }
});

checkUser();

renderProfile();