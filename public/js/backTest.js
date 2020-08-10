/* global $, Swal app */
window.localStorage.setItem('page', 'backTest');

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
app.addCase = async function () {

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
  let endDate = ey + '-' + em + '-' + ed;
  let sy = (today.getFullYear() - 1).toString();
  let startDate = sy + '-' + em + '-' + ed;

  let num = $('#case').children('.title').length;
  if (num<5) {

    let title = $('<div>').attr('class', 'title').text(`歷史回測條件單 #${num + 1}`).append($('<div>').attr('class', 'note'));

    let base = $('<div>').attr('class', 'base').append(
      $('<div>').attr('class', 'subtitle').text('基本設定'),
      $('<div>').attr('class', 'items').text('股票名稱/代碼'),
      $('<input>').attr('type', 'text').attr('class', `code${num + 1}`).attr('placeholder', 'ex. 2330'),
      $('<div>').attr('class', 'items').text('開始日期'),
      $('<input>').attr('type', 'date').attr('class', `searchStartDay${num + 1}`).val(startDate),
      $('<div>').attr('class', 'items').text('結束日期'),
      $('<input>').attr('type', 'date').attr('class', `searchEndDay${num + 1}`).val(endDate),
      $('<div>').attr('class', 'items').text('資金(單位:千)'),
      $('<input>').attr('type', 'text').attr('class', `property${num + 1}`).attr('placeholder', 'ex. 10000'),
      $('<div>').attr('class', 'items').text('券商折扣(%)'),
      $('<input>').attr('type', 'text').attr('class', `discount${num + 1}`).attr('placeholder', 'ex. 40'),
    );

    let inputIncreaseBuy = $('<input>').attr('class', `increase${num + 1}`).attr('name', `increase${num + 1}`).attr('type', 'radio').attr('value', 'buy').add('<div>'+'買'+'</div>');
    let inputIncreaseSell = $('<input>').attr('class', `increase${num + 1}`).attr('name', `increase${num + 1}`).attr('type', 'radio').attr('value', 'sell').add('<div>' + '賣' + '</div>');
    let inputDecreaseBuy = $('<input>').attr('class', `decrease${num + 1}`).attr('name', `decrease${num + 1}`).attr('type', 'radio').attr('value', 'buy').add('<div>' + '買' + '</div>');
    let inputDecreaseSell = $('<input>').attr('class', `decrease${num + 1}`).attr('name', `decrease${num + 1}`).attr('type', 'radio').attr('value', 'sell').add('<div>' + '賣' + '</div>');

    inputIncreaseSell.attr('checked', 'checked');
    inputDecreaseBuy.attr('checked', 'checked');

    let advance = $('<div>').attr('class', 'advance').append(
      $('<div>').attr('class', 'subtitle').text('交易策略'),
      $('<div>').attr('class', 'itemss').text('上漲(%)'),
      $('<input>').attr('type', 'text').attr('class', `increase${num + 1}`).attr('placeholder', 'ex. 5'),

      $('<div>').attr('class', `itemss increase${num + 1}`).append(inputIncreaseBuy).append(inputIncreaseSell),

      $('<input>').attr('type', 'text').attr('class', `increaseText${num + 1}`).attr('name', 'increase').attr('placeholder', 'ex. 5'),

      $('<div>').attr('class', 'itemss').text('下跌(%)'),
      $('<input>').attr('type', 'text').attr('class', `decrease${num + 1}`).attr('placeholder', 'ex. 3'),

      $('<div>').attr('class', `itemss decrease${num + 1}`).append(inputDecreaseBuy).append(inputDecreaseSell),

      $('<input>').attr('type', 'text').attr('class', `decreaseText${num + 1}`).attr('name', 'decrease').attr('placeholder', 'ex. 1'),

    );

    let userOption = $('<div>').attr('class', 'userOption');
    userOption.append(base).append(advance);
    $('#case').append(title);
    $('#case').append(userOption);
  } else {
    await Swal.fire({
      title: '已達新增上限',
      icon: 'warning',
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
    $('.add').text('已達上限').attr('disabled', true).css('width', '94px').css('background-color', '#f15e5e');
  }
};

app.submitData = async function () {
  let num = $('#case').children('.title').length;

  let result = [];
  for (let i = 1; i < num+1; i++) {
    let caseNo = `case${i}`;

    let code = $(`.code${i}`).val();
    let start = $(`.searchStartDay${i}`).val();
    let end = $(`.searchEndDay${i}`).val();
    let startDate = start.split('-')[0] + start.split('-')[1] + start.split('-')[2];
    let endDate = end.split('-')[0] + end.split('-')[1] + end.split('-')[2];

    let property = $(`.property${i}`).val();
    let discount = $(`.discount${i}`).val();

    let increaseAct = $(`.increase${i}:checked`).val();
    let increase = $(`.increase${i}`).val();
    let increaseCount = $(`.increaseText${i}`).val();
    let decreaseAct = $(`.decrease${i}:checked`).val();
    let decrease = $(`.decrease${i}`).val();
    let decreaseCount = $(`.decreaseText${i}`).val();

    let data = {
      code: code,
      startDate: startDate,
      endDate: endDate,
      property: property,
      discount: discount,
      increaseAct: increaseAct,
      increase: increase,
      increaseCount: increaseCount,
      decreaseAct: decreaseAct,
      decrease: decrease,
      decreaseCount: decreaseCount,
    };
    let index = {
      id: caseNo,
      data: data,
    };
    result.push(index);
  }
  $('.test').text('計算中').attr('disabled', true).css('width', '94px').css('background-color', '#f15e5e');

  Swal.fire({
    icon: 'info',
    title: '計算中，請稍後!',
    timerProgressBar: true,
    allowOutsideClick: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  });
  let url = 'api/1.0/backTest';
  let body = await app.fetchPostData(url, result);
  if (body.data.length === 0) {
    $('.alters').remove();
    Swal.fire({
      icon: 'error',
      title: '查無相符股票',
      text: '請重新選擇條件',
    });
    $('.submit').val('送出').attr('disabled', false);
    return;
  }
  let data = JSON.stringify(body);
  window.localStorage.setItem('backTestToken', data);
  await Swal.fire({
    icon: 'success',
    title: '查詢成功，即將轉向...',
    showConfirmButton: false,
    timer: 1500,
  });
  window.location.replace('/result.html');
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
      let result = Swal.fire({
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

app.addCase();