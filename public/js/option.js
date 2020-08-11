/* global $ Swal app*/
window.localStorage.setItem('page', 'option');

app.fetchPostData = async function  (url, data) {
  let res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
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

// main function
app.submitData = async () => {

  let searchEndDay = '';
  let countDays = '';
  let increase = '';
  let decrease = '';

  if ($('#countDays').val() === '') {
    countDays = '25';
  } else {
    countDays = $('#countDays').val();
  }

  if ($('.searchEndDay').val() === '') {
    let today = new Date();
    let ey = today.getFullYear().toString();
    let em = (today.getMonth() + 1).toString();
    if (em.length === 1) {
      em = '0' + em;
    }
    let ed = today.getDate().toString();
    if (ed.length === 1) {
      ed = '0' + ed;
    }
    searchEndDay = ey + '-' + em + '-' + ed;
  } else {
    searchEndDay = $('.searchEndDay').val();
  }

  let upperPrice;
  let lowerPrice;

  if ($('.upperPrice').val() === '') {
    upperPrice = '1000';
  } else {
    upperPrice = $('.upperPrice').val();
  }

  if ($('.lowerPrice').val() === '') {
    lowerPrice = '0';
  } else {
    lowerPrice = $('.lowerPrice').val();
  }

  if ($('#increase').val() === '') {
    increase = '5';
  } else {
    increase = 0;
  }

  if ($('#decrease').val() === '') {
    decrease = '5';
  } else {
    decrease = 0;
  }

  let graph = $('input:checked').val();

  let y = Number(searchEndDay.split('-')[0]);
  let m = searchEndDay.split('-')[1];
  let d = searchEndDay.split('-')[2];
  y = y - 1;
  let searchStartDay = `${y}` + '-' + `${m}` + '-' + `${d}`;

  let userFilter = {
    start: searchStartDay,
    end: searchEndDay,
    upper: upperPrice,
    lower: lowerPrice,
    graph: graph,
    count: countDays,
    increase: increase,
    decrease: decrease,
  };

  $('.submit')
    .val('計算中')
    .css('width', '94px')
    .css('background-color', '#f15e5e');

  window.location.replace(`/filter.html?startDate=${userFilter.start}&endDate=${userFilter.end}&upper=${userFilter.upper}&lower=${userFilter.lower}&graph=${userFilter.graph}&count=${userFilter.count}&increase=${userFilter.increase}&decrease=${userFilter.decrease}`);
};

app.checkGraph = function () {
  let radioValue = $('input:checked').val();
  let optional = $('<div>').attr('class', 'optional');
  let graphNote = $('.graphNote');
  if (radioValue === 'reverseV') {
    $('.optional').remove();
    $('.explain').remove();
    let inputs = $('<input>').attr('id', 'countDays').attr('class', 'countDays').attr('type', 'text').attr('placeholder', 'ex. 25');
    let countDays = $('<div>').attr('id', 'itemss').attr('class', 'countDays').text('圖形區間');
    let img = $('<img>').attr('class', 'explain').attr('src', '../imgs/vTrend.png');
    optional.append(countDays);
    optional.append(inputs);
    graphNote.append(img);
    $('.dif').append(optional);
  } else if (radioValue === 'uptrend') {
    $('.optional').remove();
    $('.explain').remove();
    let inputs = $('<input>').attr('id', 'countDays').attr('class', 'countDays').attr('type', 'text').attr('placeholder', 'ex. 25');
    let countDays = $('<div>').attr('id', 'itemss').attr('class', 'countDays').text('圖形區間');
    let input = $('<input>').attr('id', 'increase').attr('type', 'text').attr('placeholder', 'ex. 5');
    let increase = $('<div>').attr('id', 'itemss').attr('class', 'increase').text('上漲 %');
    let img = $('<img>').attr('class', 'explain').attr('src', '../imgs/upTrend.png');
    optional.append(countDays);
    optional.append(inputs);
    optional.append(increase);
    optional.append(input);
    graphNote.append(img);
    $('.dif').append(optional);
  } else if (radioValue === 'downtrend') {
    $('.optional').remove();
    $('.explain').remove();
    let inputs = $('<input>').attr('id', 'countDays').attr('class', 'countDays').attr('type', 'text').attr('placeholder', 'ex. 25');
    let countDays = $('<div>').attr('id', 'itemss').attr('class', 'countDays').text('圖形區間');
    let input = $('<input>').attr('id', 'decrease').attr('type', 'text').attr('placeholder', 'ex. 5');
    let decrease = $('<div>').attr('id', 'itemss').attr('class', 'decrease').text('下跌 %');
    let img = $('<img>').attr('class', 'explain').attr('src', '../imgs/downTrend.png');
    optional.append(countDays);
    optional.append(inputs);
    optional.append(decrease);
    optional.append(input);
    graphNote.append(img);
    $('.dif').append(optional);
  } else {
    $('.optional').remove();
    $('.explain').remove();
    let img = $('<img>').attr('class', 'explain').attr('src', '../imgs/rangeTrend.png');
    graphNote.append(img);
    $('.dif').append(optional);
  }
};

app.renderToday = function () {
  let now = new Date();
  let ey = now.getFullYear().toString();
  let em = (now.getMonth() + 1).toString();
  if (em.length === 1) {
    em = '0' + em;
  }
  let ed = now.getDate().toString();
  if (ed.length === 1) {
    ed = '0' + ed;
  }
  let searchEndDay = ey + '-' + em + '-' + ed;
  $('.searchEndDay').val(searchEndDay);
};

// init function
app.checkUser = async function () {
  if (window.localStorage.getItem('userToken')) {
    const data = {
      token: window.localStorage.getItem('userToken'),
    };
    let url = 'api/1.0/user/profile';
    let body = await app.fetchPostData(url, data);

    if (body.error) {
      let result = await Swal.fire({
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
    let result = await Swal.fire({
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


app.checkUser();

app.checkGraph();

app.renderToday();