/* global $, Swal, d3, app*/
window.localStorage.setItem('page', 'basic');

let currentCode = '2330';
// let currentName = '台積電';
app.graphData = null;

app.fetchPostData = async function (url, data) {
  let res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  return res.json();
};

app.fetchGetData = async function (url) {
  let res = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
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

app.searchDate = async function () {

  const urlParams = new URLSearchParams(window.location.search);

  let startDate;
  let endDate;

  if ($('.startDay').val() !== '' && $('.endDay').val() !== '') {
    startDate = $('.startDay').val();
    endDate = $('.endDay').val();
    if ((Number(endDate.split('-')[0]) - Number(startDate.split('-')[0])) === 0) {
      if (Number(endDate.split('-')[1]) - Number(startDate.split('-')[1]) < 2) {
        Swal.fire({
          icon: 'error',
          title: '找尋範圍太小，MACD 與 RSI 將無法正確顯示',
        });
        return;
      }
    } else if ((Number(endDate.split('-')[0]) - Number(startDate.split('-')[0])) < 0) {
      Swal.fire({
        icon: 'error',
        title: '找尋範圍錯誤，請重新選擇日期',
      });
      return;
    }
  } else if ($('.startDay').val() === '' && $('.endDay').val() !== '') {
    let end = $('.endDay').val();
    let sy = ((end.split('-')[0]) - 1).toString();
    let sm = ((end.split('-')[1])).toString();
    let sd = ((end.split('-')[2])).toString();
    startDate = sy + '-' + sm + '-' + sd;
    endDate = $('.endDay').val();
  } else if ($('.startDay').val() !== '' && $('.endDay').val() === '') {
    let today = new Date();
    let ey = (today.getFullYear()).toString();
    let em = (today.getMonth() + 1).toString();
    if (em.length === 1) {
      em = '0' + em;
    }
    let ed = (today.getDate()).toString();
    if (ed.length === 1) {
      ed = '0' + ed;
    }
    endDate = ey + '-' + em + '-' + ed;
    startDate = $('.startDay').val();
    if ((Number(endDate.split('-')[1]) - Number(startDate.split('-')[1])) < 1) {
      Swal.fire({
        icon: 'error',
        title: '找尋範圍太小，MACD 與 RSI 將無法正確顯示',
      });
    }
  } else {
    await Swal.fire({
      icon: 'warning',
      title: '請填寫日期',
    });
    return;
  }

  let code = urlParams.get('stock');
  if (code === null) {
    code = currentCode;
  }

  let userSearch = {
    stockCode: code,
    startDate: startDate,
    endDate: endDate,
  };

  $('.startDay').val(startDate);
  $('.endDay').val(endDate);

  window.location.replace(`/basic.html?stock=${userSearch.stockCode}&start=${userSearch.startDate}&end=${userSearch.endDate}`);
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
};

app.renderKBar = async function () {
  d3.select('.graphlayout').remove();
  app.currGraph = null;
  let localData = window.localStorage.getItem('home');
  app.graphData = JSON.parse(localData);
  let d3Graph = await app.d3init(app.graphData);
  await app.renderInfor(app.graphData);

  let data = [];

  for (let i = 0; i < app.graphData.length; i++) {
    let oldDate = app.graphData[i].date;
    app.graphData[i].date = new Date(oldDate);
    data.push(app.graphData[i]);
  }

  await app.kBarSetting(d3Graph, data);
  app.zoom(d3Graph);
  app.draw(d3Graph);
  app.currGraph = d3Graph;
};

app.renderClose = async function () {
  d3.select('.graphlayout').remove();
  app.currGraph = null;
  let d3Graph = await app.d3init();

  let localData = window.localStorage.getItem('home');

  app.graphData = JSON.parse(localData);

  await app.renderInfor(app.graphData);

  let data = [];

  for (let i = 0; i < app.graphData.length; i++) {
    let oldDate = app.graphData[i].date;
    app.graphData[i].date = new Date(oldDate);
    data.push(app.graphData[i]);
  }

  await app.closeSetting(d3Graph, data);
  app.zoom(d3Graph);
  app.draw(d3Graph);
  app.currGraph = d3Graph;
};

app.checkVolume = function () {
  if ($('.volumes').is(':checked') === true) {
    app.volumeRender(app.currGraph, app.graphData);
  } else {
    app.volumeCancel(app.currGraph, app.graphData);
  }
};

app.checkMA = function () {
  if ($('.ma').is(':checked') === true) {
    app.smaAndema(app.currGraph, app.graphData);
  } else {
    app.smaCancel(app.currGraph, app.graphData);
  }
};

app.indicate = function () {
  let display = $('.indicate').css('display');
  if (display === 'none') {
    $('.indicate').css('display', 'block');
  } else {
    $('.indicate').css('display', 'none');
  }
};

// init function
app.renderInit = async function () {
  const urlParams = new URLSearchParams(window.location.search);

  let code = urlParams.get('stock');
  let startDate = urlParams.get('start');
  let endDate = urlParams.get('end');

  if (code === null) {
    code = currentCode;
  }

  if (startDate === null && endDate === null) {
    let today = new Date();
    let ey = (today.getFullYear()).toString();
    let em = (today.getMonth() + 1).toString();
    if (em.length === 1) {
      em = '0' + em;
    }
    let ed = (today.getDate()).toString();
    if (ed.length === 1) {
      ed = '0' + ed;
    }
    endDate = ey + '-' + em + '-' + ed;
    let sy = (today.getFullYear() - 1).toString();
    startDate = sy + '-' + em + '-' + ed;
  }
  let userSearch = {
    stockCode: code,
    startDate: startDate,
    endDate: endDate,
  };

  $('.startDay').val(startDate);
  $('.endDay').val(endDate);

  let url = `api/1.0/stock?code=${userSearch.stockCode}&start=${userSearch.startDate}&end=${userSearch.endDate}`;
  let body = await app.fetchGetData(url);
  if (body.error) {
    await Swal.fire({
      icon: 'error',
      title: '查無相符股票，請重新選擇條件',
    }).
    window.location.replace('/basic.html');
    return;
  }
  for (let i = 0; i < body.data.length; i++) {
    let strDate = body.data[i].date.toString();
    let y = strDate[0] + strDate[1] + strDate[2] + strDate[3] + '/';
    let m = strDate[4] + strDate[5] + '/';
    let d = strDate[6] + strDate[7];
    body.data[i].date = new Date(y + m + d);
  }
  currentCode = body.data[0].code;
  // currentName = body.data[0].name;
  let datas = JSON.stringify(body.data);
  window.localStorage.setItem('home', datas);
  app.renderKBar();
};

app.checkUser = async function () {
  if (window.localStorage.getItem('userToken')) {
    const data = {
      token: window.localStorage.getItem('userToken'),
    };
    let url = 'api/1.0/user/profile';
    let body = await app.fetchPostData(url, data);
    if (body.error) {
      $('.memberLink').attr('href', './signin.html');
      $('.member').text('Sign up / Log in');
    } else {
      $('.memberLink').attr('href', './profile.html');
      $('.member').text(`${body.name}`);
    }
  } else {
    $('.memberLink').attr('href', './signin.html');
    $('.member').text('Sign up / Log in');
  }
};

app.checkPage = function () {
  window.localStorage.setItem('page', 'profile');
  window.location.replace('../profile.html');
};

$('.chart').change(function () {
  var t = $(this).val();
  if (t === 'candle') {
    app.renderKBar();
  } else if (t === 'line') {
    app.renderClose();
  }
});

app.renderInit();

app.checkUser();