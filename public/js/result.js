/* global $ Swal*/
window.localStorage.setItem('page', 'result');

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

let c = 'rgba(51, 51, 51, 0.902)';
let r = 'red';
let g = 'green';



function backTestResult() {
  if (window.localStorage.getItem('backTestToken')) {
    let data = JSON.parse(window.localStorage.getItem('backTestToken'));
    for (let i = 0; i < data.data.length; i++) {

      let tr = $('<tr>').attr('class', 'itemName').append(
        $('<th>').attr('class', 'number').text('#'),
        $('<th>').attr('class', 'date').text('日期'),
        $('<th>').attr('class', 'situation').text('委託狀況'),
        $('<th>').attr('class', 'count').text('張數'),
        $('<th>').attr('class', 'value').text('股價'),
        $('<th>').attr('class', 'cost').text('交易成本'),
        $('<th>').attr('class', 'property').text('資產狀況'),
        $('<th>').attr('class', 'profit').text('獲利'),
      );
      let thead = $('<thead>').append(tr);
      let caption = $('<caption>').attr('class', `case${i+1}`).text(`Case #${i+1}`);
      let table = $('<table>').attr('class', 'detail');
      // let tbody = $("<tbody>").attr("class", "data");
      table.append(caption);
      table.append(thead);
      // table.append(tbody)


      let tbody = $('<tbody>').attr('class', `detail${i+1}`);
      for (let j = 0; j < data.data[i].history.length; j++) {
        let tr;
        if (data.data[i].history[j].situation === 'buy') {
          let profitPercentFont = data.data[i].history[j].profitPercent;
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
          let profitPercentFont = data.data[i].history[j].profitPercent;
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



    // let tr = $('<tr>').attr('class', `detail`).append(
    //   $("<th>").attr('class', 'case').text(`Case #`),
    //   $("<th>").attr('class', 'qty').text("Stock qty"),
    //   $("<th>").attr('class', 'income').text("Income"),
    //   $("<th>").attr('class', 'cost').text("Trade cost"),
    //   $("<th>").attr('class', 'property').text("Property"),
    //   $("<th>").attr('class', 'profit').text("Profit"),
    //   $("<th>").attr('class', 'save').text("Save"),
    // );

    // let summaryNum = $('<table>').attr('class', `detail`).append(tr)

    for (let i = 0; i < data.data.length; i++) {
      let earningRateFont = (data.data[i].summary.earningRate).toString();
      if (earningRateFont[0] !== '-') {
        let inputCheck = $('<input>').attr('class', `save${i}`).attr('type', 'checkbox').attr('value', i);
        let tr = $('<tr>').attr('class', `summaryData${i}`).append(
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
        let inputCheck = $('<input>').attr('class', `save${i}`).attr('type', 'checkbox').attr('value', i);
        let tr = $('<tr>').attr('class', `summaryData${i}`).append(
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

    // $(".summary").append(summaryNum)

  }
}

backTestResult();

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

async function save() {
  $('.save').attr('disabled', true);
  if (window.localStorage.getItem('backTestToken')) {
    let dataString = window.localStorage.getItem('backTestToken');
    let data = JSON.parse(dataString);
    let num = data.data.length;
    let results = {};
    results.data = [];
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        if ($(`.save${i}:checked`).val() === data.data[j].id) {
          let code = $(`.save${i}:checked`).val();
          console.log('找到了', code);
          let result = {
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
    console.log(results);
    let url = 'api/1.0/saveFilter';
    let body = await fetchPostData(url, results);
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
}

$('.search').on('keypress', function (e) {
  if (e.key === 'Enter') {
    let code = $('.search').val();
    window.localStorage.setItem('homeCode', code);
    window.location.replace(`/basic.html?stock=${code}`);
  }
});

function pageCheck() {
  window.localStorage.setItem('page', 'profile');
  window.location.replace('../profile.html');
}

async function saveBacktestHistory() {
  $('.save').attr('disabled', true);
  if (window.localStorage.getItem('backTestToken')) {

    let dataString = window.localStorage.getItem('backTestToken');
    let data = JSON.parse(dataString);
    let num = data.data.length;

    let results = {};
    results.data = [];
    for (let i = 0; i < num; i++) {
      if ($(`.save${i}:checked`).val() !== undefined) {
        let result = {
          case: data.data[i].case,
          history: data.data[i].history,
          summary: data.data[i].summary,
          condition: data.data[i].condition,
        };
        results.data.push(result);
      }
    }

    results.user = window.localStorage.getItem('userToken');
    console.log(results)
    let url = 'api/1.0/saveBackTest';
    let body = await fetchPostData(url, results);
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
}