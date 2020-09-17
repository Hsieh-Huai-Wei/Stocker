/* global $ Swal app*/
window.localStorage.setItem('page', 'result');

async function fetchPostData(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  return res.json();
}

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
app.renderList = function () {

  const today = new Date();
  // let ey = (today.getFullYear()).toString();
  let em = (today.getMonth() + 1).toString();
  if (em.length === 1) {
    em = '0' + em;
  }
  let ed = (today.getDate()).toString();
  if (ed.length === 1) {
    ed = '0' + ed;
  }

  const c = 'rgba(51, 51, 51, 0.902)';
  const r = 'red';
  const g = 'green';

  if (window.localStorage.getItem('backTestToken')) {
    const data = JSON.parse(window.localStorage.getItem('backTestToken'));
    for (let i = 0; i < data.data.length; i++) {

      const tr = $('<tr>').attr('class', 'itemName').append(
        $('<th>').attr('class', 'number').text('#'),
        $('<th>').attr('class', 'date').text('日期'),
        $('<th>').attr('class', 'situation').text('委託狀況'),
        $('<th>').attr('class', 'count').text('張數'),
        $('<th>').attr('class', 'value').text('股價'),
        $('<th>').attr('class', 'cost').text('交易成本'),
        $('<th>').attr('class', 'property').text('資產狀況'),
        $('<th>').attr('class', 'profit').text('獲利'),
      );
      const thead = $('<thead>').append(tr);
      const caption = $('<caption>').attr('class', `case${i+1}`).text(`Case #${i+1}`);
      const table = $('<table>').attr('class', 'detail');
      // let tbody = $("<tbody>").attr("class", "data");
      table.append(caption);
      table.append(thead);
      // table.append(tbody)


      const tbody = $('<tbody>').attr('class', `detail${i+1}`);
      for (let j = 0; j < data.data[i].history.length; j++) {
        let tr;
        if (data.data[i].history[j].situation === 'buy') {
          const profitPercentFont = data.data[i].history[j].profitPercent;
          if (profitPercentFont[0] !== '-') {
            tr = $('<tr>').attr('class', `detail${i + 1}`).append(
              $('<td>').attr('class', 'number').css('background-color', c).append(`${j + 1}`),
              $('<td>').attr('class', 'date').css('background-color', c).append(data.data[i].history[j].information),
              $('<td>').attr('class', 'situation').css('background-color', c).append(data.data[i].history[j].situation),
              $('<td>').attr('class', 'count').css('background-color', c).append(data.data[i].history[j].stock),
              $('<td>').attr('class', 'value').css('background-color', c).append(data.data[i].history[j].value),
              $('<td>').attr('class', 'cost').css('background-color', c).append(data.data[i].history[j].tradeCost),
              $('<td>').attr('class', 'property').css('background-color', c).append(data.data[i].history[j].property),
              $('<td>').attr('class', 'profit').css('background-color', c).css('color', r).append(data.data[i].history[j].profitPercent),
            );
          } else {
            tr = $('<tr>').attr('class', `detail${i + 1}`).append(
              $('<td>').attr('class', 'number').css('background-color', c).append(`${j + 1}`),
              $('<td>').attr('class', 'date').css('background-color', c).append(data.data[i].history[j].information),
              $('<td>').attr('class', 'situation').css('background-color', c).append(data.data[i].history[j].situation),
              $('<td>').attr('class', 'count').css('background-color', c).append(data.data[i].history[j].stock),
              $('<td>').attr('class', 'value').css('background-color', c).append(data.data[i].history[j].value),
              $('<td>').attr('class', 'cost').css('background-color', c).append(data.data[i].history[j].tradeCost),
              $('<td>').attr('class', 'property').css('background-color', c).append(data.data[i].history[j].property),
              $('<td>').attr('class', 'profit').css('background-color', c).css('color', g).append(data.data[i].history[j].profitPercent),
            );
          }

        } else {
          const profitPercentFont = data.data[i].history[j].profitPercent;
          if (profitPercentFont[0] !== '-') {
            tr = $('<tr>').attr('class', `detail${i + 1}`).append(
              $('<td>').attr('class', 'number').append(`${j + 1}`),
              $('<td>').attr('class', 'date').append(data.data[i].history[j].information),
              $('<td>').attr('class', 'situation').append(data.data[i].history[j].situation),
              $('<td>').attr('class', 'count').append(data.data[i].history[j].stock),
              $('<td>').attr('class', 'value').append(data.data[i].history[j].value),
              $('<td>').attr('class', 'cost').append(data.data[i].history[j].tradeCost),
              $('<td>').attr('class', 'property').append(data.data[i].history[j].property),
              $('<td>').attr('class', 'profit').css('color', r).append(data.data[i].history[j].profitPercent),
            );
          } else {
            tr = $('<tr>').attr('class', `detail${i + 1}`).append(
              $('<td>').attr('class', 'number').append(`${j + 1}`),
              $('<td>').attr('class', 'date').append(data.data[i].history[j].information),
              $('<td>').attr('class', 'situation').append(data.data[i].history[j].situation),
              $('<td>').attr('class', 'count').append(data.data[i].history[j].stock),
              $('<td>').attr('class', 'value').append(data.data[i].history[j].value),
              $('<td>').attr('class', 'cost').append(data.data[i].history[j].tradeCost),
              $('<td>').attr('class', 'property').append(data.data[i].history[j].property),
              $('<td>').attr('class', 'profit').css('color', g).append(data.data[i].history[j].profitPercent),
            );
          }
        }
        tbody.append(tr);
      }
      table.append(tbody);

      $('.testResult').append(table);
    }

    for (let i = 0; i < data.data.length; i++) {
      const earningRateFont = (data.data[i].summary.earningRate).toString();
      if (earningRateFont[0] !== '-') {
        const inputCheck = $('<input>').attr('class', `save${i}`).attr('type', 'checkbox').attr('value', i);
        const tr = $('<tr>').attr('class', `summaryData${i}`).append(
          $('<td>').attr('class', 'case').append(`case #${i+1}`),
          $('<td>').attr('class', 'code').append(data.data[i].case.code),
          $('<td>').attr('class', 'date').append(data.data[i].case.startDate + '</br>' + '~' + '</br>' + data.data[i].case.endDate),
          $('<td>').attr('class', 'qty').append(data.data[i].summary.finalStock),
          $('<td>').attr('class', 'qty').append(data.data[i].summary.stockValue),
          $('<td>').attr('class', 'income').append(data.data[i].summary.tradeCost),
          $('<td>').attr('class', 'cost').append(data.data[i].summary.totalAssets),
          $('<td>').attr('class', 'property').append(data.data[i].summary.income),
          $('<td>').attr('class', 'profit').css('color', r).append(data.data[i].summary.earningRate),
          $('<td>').attr('class', 'save').append(inputCheck)
        );
        $('.summaryData').append(tr);
      } else {
        const inputCheck = $('<input>').attr('class', `save${i}`).attr('type', 'checkbox').attr('value', i);
        const tr = $('<tr>').attr('class', `summaryData${i}`).append(
          $('<td>').attr('class', 'case').append(`case #${i+1}`),
          $('<td>').attr('class', 'code').append(data.data[i].case.code),
          $('<td>').attr('class', 'date').append(data.data[i].case.startDate + '</br>' + '~' + '</br>' + data.data[i].case.endDate),
          $('<td>').attr('class', 'qty').append(data.data[i].summary.finalStock),
          $('<td>').attr('class', 'qty').append(data.data[i].summary.stockValue),
          $('<td>').attr('class', 'income').append(data.data[i].summary.tradeCost),
          $('<td>').attr('class', 'cost').append(data.data[i].summary.totalAssets),
          $('<td>').attr('class', 'property').append(data.data[i].summary.income),
          $('<td>').attr('class', 'profit').css('color', g).append(data.data[i].summary.earningRate),
          $('<td>').attr('class', 'save').append(inputCheck)
        );
        $('.summaryData').append(tr);
      }
    }
  }
};

app.saveBacktestHistory = async function () {
  $('.save').attr('disabled', true);
  if (window.localStorage.getItem('backTestToken')) {

    const dataString = window.localStorage.getItem('backTestToken');
    const data = JSON.parse(dataString);
    const num = data.data.length;

    const results = {};
    results.data = [];
    for (let i = 0; i < num; i++) {
      if ($(`.save${i}:checked`).val() !== undefined) {
        const result = {
          case: data.data[i].case,
          history: data.data[i].history,
          summary: data.data[i].summary,
          condition: data.data[i].condition,
        };
        results.data.push(result);
      }
    }
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
    results.user = window.localStorage.getItem('userToken');
    const url = 'api/1.0/saveBackTest';
    const body = await fetchPostData(url, results);
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
app.checkUser = async function () {
  if (window.localStorage.getItem('userToken')) {
    const data = {
      token: window.localStorage.getItem('userToken'),
    };
    const url = 'api/1.0/user/profile';
    const body = await fetchPostData(url, data);

    if (body.error) {
      const result = Swal.fire({
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
    const result = Swal.fire({
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

app.renderList();

app.checkUser();
