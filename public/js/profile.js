/* global  $ Swal app d3*/
app.filterHistoryData = null;
app.choiceStockTrend = null;
app.choiceStockData = null;

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

async function userTokenCheck() {
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
      $('.member').text(`${body.name}`);
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

function profile() {
  $('#overview').css('color', '#656565');
  $('#overview').css('border-bottom-color', '#656565');
  $('#profile').css('color', '#ffffff');
  $('#profile').css('border-bottom-color', '#ffffff');
  $('.context').show();
  $('.filter').hide();
  $('.resultTable').hide();
  $('.graphOption').hide();
  $('.info_block').hide();
}

profile();

$('.search').on('keypress', function (e) {
  if (e.key === 'Enter') {
    let code = $('.search').val();
    window.localStorage.setItem('homeCode', code);
    window.location.replace('../basic.html');
  }
});

function renderInfor(data) {
  $('.name').remove();
  $('.price').remove();
  $('.change').remove();
  let len = data.length;
  let infor = data[len - 1];
  let name = $('<div>')
    .attr('class', 'name')
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

async function kBarRender(trendData) {
  d3.select('.graph123').remove();
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

async function closeRender(trendData) {
  d3.select('.graph123').remove();
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

  for (let i = 0; i < body.data.length; i++){
    let oldDate = body.data[i].date.toString();
    let y = oldDate[0] + oldDate[1] + oldDate[2] + oldDate[3];
    let m = oldDate[4] + oldDate[5];
    let d = oldDate[6] + oldDate[7];
    let newDateString = y + "-" + m + "-" + d;
    let newDate = new Date(newDateString);
    body.data[i].date = newDate;
  }
  app.choiceStockData = body.data;

  kBarRender(backTestTrend);
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

async function graphView() {
  $('#graphView').css('color', '#ffffff');
  $('#graphView').css('border-bottom-color', '#ffffff');
  $('#profile').css('color', '#656565');
  $('#profile').css('border-bottom-color', '#656565');

  let url = 'api/1.0/user/graphView';
  let body = await fetchGetData(url);
  app.filterHistoryData = body;
  for (let i=0; i < body.length; i++) {
    // user search condition
    var tr = $('<tr>').attr('class', 'userOption').append(
      $('<td>').attr('class', 'userChoice').click(function () { `${choiceStock(i)}`}).append("#" + (i+1)),
      $('<td>').attr('class', 'userChoice').click(function () { `${choiceStock(i)}`}).append(body[i].stock_code),
      $('<td>').attr('class', 'userChoice').click(function () { `${choiceStock(i)}`}).append(body[i].name),
      $('<td>').attr('class', 'userChoice').click(function () { `${choiceStock(i)}`}).append(body[i].start),
      $('<td>').attr('class', 'userChoice').click(function () { `${choiceStock(i)}`}).append(body[i].end),
      $('<td>').attr('class', 'userChoice').click(function () { `${choiceStock(i)}`}).append(body[i].upper),
      $('<td>').attr('class', 'userChoice').click(function () { `${choiceStock(i)}`}).append(body[i].lower),
      $('<td>').attr('class', 'userChoice').click(function () { `${choiceStock(i)}`}).append(body[i].graph),
      $('<td>').attr('class', 'userChoice').click(function () { `${choiceStock(i)}`}).append(body[i].count),
      $('<td>').attr('class', 'userChoice').click(function () { `${choiceStock(i)}`}).append(body[i].increase),
      $('<td>').attr('class', 'userChoice').click(function () { `${choiceStock(i)}`}).append(body[i].decrease),
    );
    $('#userOption').append(tr);
  }

  $('.context').hide();
  $('.filter').show();
  $('.resultTable').show();
  $('.graphOption').show();
  $('.info_block').show();
}

function TestRecord() {
  $('#overview').css('color', '#ffffff');
  $('#overview').css('border-bottom-color', '#ffffff');
  $('#profile').css('color', '#656565');
  $('#profile').css('border-bottom-color', '#656565');

  if (window.localStorage.getItem('userToken')) {
    const data = {
      token: window.localStorage.getItem('userToken'),
    };

    fetch('api/1.0/filterHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((body) => {
        console.log(body);
      });
  }




  $('.context').hide();
  $('.filter').show();
  $('.resultTable').show();
  $('.graphOption').show();
  $('.info_block').show();
}


$('.chart').change(function () {
  var t = $(this).val();
  if (t === 'candle') {
    kBarRender(app.choiceStockTrend);
  } else if (t === 'line') {
    closeRender(app.choiceStockTrend);
  }
});