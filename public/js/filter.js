/* global $ Swal d3 app*/
window.localStorage.setItem('page', 'filter');

app.currentCode = null;
app.choiceStockData = null;
app.choiceStockTrend = null;

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
    .attr('class', 'name')
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

app.renderClose = async function () {
  d3.select('.graphlayout').remove();
  app.currGraph = null;
  const d3Graph = await app.d3init(app.choiceStockData);

  const datas = app.choiceStockData;
  const trendData = app.choiceStockTrend;

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
app.choiceStock = function (data) {
  const optionStock = window.localStorage.getItem('optionResult');
  const optionResult = JSON.parse(optionStock);
  app.currentCode = data[0].code;
  const choiceStock = app.currentCode;
  for (let i = 0; i < optionResult.data.length; i++) {
    if (optionResult.data[i].id === choiceStock) {
      for (let j = 0; j < optionResult.data[i].data.length; j++) {
        const strDate = optionResult.data[i].data[j].date.toString();
        const y = strDate[0] + strDate[1] + strDate[2] + strDate[3] + '/';
        const m = strDate[4] + strDate[5] + '/';
        const d = strDate[6] + strDate[7];
        optionResult.data[i].data[j].date = new Date(y + m + d);
      }
      for (let j = 0; j < optionResult.data[i].trend.length; j++) {
        for (let k = 0; k < optionResult.data[i].trend[j].length; k++) {
          const startDate = optionResult.data[i].trend[j][k].startDate.toString();
          const endDate = optionResult.data[i].trend[j][k].endDate.toString();
          const sy =
            startDate[0] + startDate[1] + startDate[2] + startDate[3] + '/';
          const sm = startDate[4] + startDate[5] + '/';
          const sd = startDate[6] + startDate[7];
          const ey = endDate[0] + endDate[1] + endDate[2] + endDate[3] + '/';
          const em = endDate[4] + endDate[5] + '/';
          const ed = endDate[6] + endDate[7];
          optionResult.data[i].trend[j][k].startDate = new Date(sy + sm + sd);
          optionResult.data[i].trend[j][k].endDate = new Date(ey + em + ed);
        }
      }

      $('.name').remove();
      $('.price').remove();
      $('.change').remove();

      const len = optionResult.data[0].data.length;
      const infor = optionResult.data[0].data[len - 1];
      const name = $('<div>')
        .attr('class', 'name')
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
      app.choiceStockData = optionResult.data[i].data;
      app.choiceStockTrend = optionResult.data[i].trend;
      break;
    }
  }
  app.renderKBar(app.choiceStockTrend);
};

app.renderList = async function () {
  if (window.localStorage.getItem('optionResult')) {
    const data = JSON.parse(window.localStorage.getItem('optionResult'));

    let graph = '';
    if (data.inf.graph === 'reverseV') {
      graph = 'V型反轉';
    } else if (data.inf.graph === 'uptrend') {
      graph = '上升趨勢線';
    } else if (data.inf.graph === 'downtrend') {
      graph = '下跌趨勢線';
    } else {
      graph = '無';
    }

    let increase = '';
    if (data.inf.increase === 0) {
      increase = '-';
    } else {
      increase = data.inf.increase;
    }
    let decrease = '';
    if (data.inf.decrease === 0) {
      decrease = '-';
    } else {
      decrease = data.inf.decrease;
    }

    // user search condition
    var tr = $('<tr>').attr('class', 'userOption').append(
      $('<td>').attr('class', 'userChoice').append(data.inf.start),
      $('<td>').attr('class', 'userChoice').append(data.inf.end),
      $('<td>').attr('class', 'userChoice').append(data.inf.upper),
      $('<td>').attr('class', 'userChoice').append(data.inf.lower),
      $('<td>').attr('class', 'userChoice').append(graph),
      $('<td>').attr('class', 'userChoice').append(data.inf.count),
      $('<td>').attr('class', 'userChoice').append(increase),
      $('<td>').attr('class', 'userChoice').append(decrease)
    );
    $('#userOption').append(tr);

    const target = 0;
    for (let i = 0; i < data.data.length; i++) {
      const priceLen = target + 1;
      const code = data.data[i].data[priceLen - 1].code;
      const inputCheck = $('<input>')
        .attr('class', `save${i}`)
        .attr('value', `${code}`)
        .attr('type', 'checkbox');
      const tr = $('<tr>')
        .attr('class', 'userOption')
        .append(
          $('<td>')
            .attr('class', 'userChoice')
            .attr('class', `code${i}`)
            .click(function () {
              `${app.choiceStock(data.data[i].data)}`;
            })
            .append(data.data[i].data[priceLen - 1].code),
          $('<td>')
            .attr('class', 'userChoice')
            .click(function () {
              `${app.choiceStock(data.data[i].data)}`;
            })
            .append(data.data[i].data[priceLen - 1].name),
          $('<td>')
            .attr('class', 'userChoice')
            .append(data.data[i].data[priceLen - 1].close),
          $('<td>')
            .attr('class', 'userChoice')
            .append(data.data[i].data[priceLen - 1].percentChange),
          $('<td>')
            .attr('class', 'userChoice')
            .append(data.data[i].data[priceLen - 1].volume),
          $('<td>')
            .attr('class', 'userChoice')
            .append(data.data[i].data[priceLen - 1].industry),
          $('<td>')
            .attr('class', 'userChoice')
            .append(data.data[i].data[priceLen - 1].total),
          $('<td>')
            .attr('class', 'userChoice')
            .append(data.data[i].data[priceLen - 1].fd),
          $('<td>')
            .attr('class', 'userChoice')
            .append(data.data[i].data[priceLen - 1].sitc),
          $('<td>')
            .attr('class', 'userChoice')
            .append(data.data[i].data[priceLen - 1].dealers),
          $('<td>')
            .attr('class', 'userChoice')
            .attr('value', `${i}`)
            .append(inputCheck)
        );
      $('.resultTable').append(tr);
    }
    const firstCode = data.data[0].data;
    app.choiceStock(firstCode);
  } else {
    await Swal.fire({
      title: '還沒有選過篩選條件哦!',
      icon: 'warning',
      confirmButtonText: '好哦!',
      reverseButtons: true,
      allowOutsideClick: false,
    });
    window.location.replace('./option.html');
  }
};

app.saveData = async function () {
  $('.save').attr('disabled', true);
  if (window.localStorage.getItem('optionResult')) {
    const dataString = window.localStorage.getItem('optionResult');
    const data = JSON.parse(dataString);
    const num = data.data.length;
    const results = {};
    results.data = [];
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        if ($(`.save${i}:checked`).val() === data.data[j].id) {
          const result = {
            id: data.data[j].id,
            trend: data.data[j].trend,
          };
          results.data.push(result);
        }
      }
    }
    results.user = window.localStorage.getItem('userToken');
    results.inf = data.inf;
    if (results.data.length === 0) {
      $('.save').attr('disabled', false);
      Swal.fire({
        title: '請勾選要儲存的股票',
        icon: 'error',
        confirmButtonText: '好哦!',
        reverseButtons: true,
      });
      return;
    }

    const url = 'api/1.0/saveFilter';
    const body = await app.fetchPostData(url, results);
    $('.save').attr('disabled', false);
    if (body.error) {
      Swal.fire({
        title: body.error,
        icon: 'error',
        confirmButtonText: '好哦!',
        reverseButtons: true,
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: '儲存成功',
        text: '已加入您個人歷史紀錄',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
};

// init function
app.renderInit = async function () {

  Swal.fire({
    icon: 'info',
    title: '計算中，請稍後!',
    timerProgressBar: true,
    allowOutsideClick: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  });

  const urlParams = new URLSearchParams(window.location.search);

  const startDate = urlParams.get('startDate');
  const endDate = urlParams.get('endDate');
  const upper = urlParams.get('upper');
  const lower = urlParams.get('lower');
  const graph = urlParams.get('graph');
  const count = urlParams.get('count');
  const increase = urlParams.get('increase');
  const decrease = urlParams.get('decrease');

  if (startDate === null || endDate === null || upper === null || lower === null || graph === null || count === null || increase === null || decrease === null) {
    await Swal.fire({
      icon: 'error',
      title: '查無相符股票',
      text: '請重新選擇條件',
    });
    window.location.replace('/option.html');
    return;
  }

  const url = `api/1.0/option?startDate=${startDate}&endDate=${endDate}&upper=${upper}&lower=${lower}&graph=${graph}&count=${count}&increase=${increase}&decrease=${decrease}`;

  const body = await app.fetchGetData(url);
  if (body.error) {
    await Swal.fire({
      icon: 'error',
      title: '伺服器錯誤',
      text: '請重新選擇條件',
    });
    window.location.replace('/option.html');
    return;
  } else if (body.data.length === 0) {
    await Swal.fire({
      icon: 'error',
      title: '查無相符股票',
      text: '請重新選擇條件',
    });
    window.location.replace('/option.html');
    return;
  }
  const data = JSON.stringify(body);
  window.localStorage.setItem('optionResult', data);
  await Swal.fire({
    icon: 'success',
    title: '查詢成功!',
    showConfirmButton: false,
    timer: 1500,
  });
  app.renderList();
};

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

app.checkPage = function () {
  window.localStorage.setItem('page', 'profile');
  window.location.replace('../profile.html');
};

$('.chart').change(function () {
  var t = $(this).val();
  if (t === 'candle') {
    app.renderKBar(app.choiceStockTrend);
  } else if (t === 'line') {
    app.renderClose(app.choiceStockTrend);
  }
});

app.renderInit();

app.checkUser();