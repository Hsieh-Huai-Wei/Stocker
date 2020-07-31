localStorage.setItem("page", "result");

let today = new Date();
let ey = (today.getFullYear()).toString();
let em = (today.getMonth() + 1).toString();
if (em.length === 1) {
  em = "0" + em;
}
let ed = (today.getDate()).toString();
if (ed.length === 1) {
  ed = "0" + ed;
}
endDate = ey + "-" + em + "-" + ed;

let c = "rgba(51, 51, 51, 0.902)";
let r = "red";
let g = "green";


function backTestResult() {
  if (localStorage.getItem('backTestToken')) {
    let data = JSON.parse(localStorage.getItem('backTestToken'))
    // console.log(data);
    // console.log(data.data.length);
    // console.log(data.data[0].case);
    // console.log(data.data[0].history);
    // console.log(data.data[0].summary);
    // console.log(data.data[0].history.length);
    // console.log(data.data[0].history[0]);
    // console.log(data.data[0].history[0].profitPercent);
    // console.log(typeof data.data[0].history[0].profitPercent);
    // console.log(data.data[0].summary.earningRate);
    // console.log(typeof data.data[0].summary.earningRate);

    for (let i = 0; i < data.data.length; i++) {


      let tr = $('<tr>').attr('class', `itemName`).append(
        $("<th>").attr('class', 'number').text("#"),
        $("<th>").attr('class', 'date').text("日期"),
        $("<th>").attr('class', 'situation').text("委託狀況"),
        $("<th>").attr('class', 'count').text("張數"),
        $("<th>").attr('class', 'value').text("股價"),
        $("<th>").attr('class', 'cost').text("交易成本"),
        $("<th>").attr('class', 'property').text("資產狀況"),
        $("<th>").attr('class', 'profit').text("獲利"),
      );
      let thead = $("<thead>").append(tr);
      let caption = $("<caption>").attr("class", `case${i+1}`).text(`Case #${i+1}`)
      let table = $("<table>").attr("class", "detail");
      // let tbody = $("<tbody>").attr("class", "data");
      table.append(caption);
      table.append(thead)
      // table.append(tbody)


      let tbody = $('<tbody>').attr('class', `detail${i+1}`)
      for (let j = 0; j < data.data[i].history.length; j++) {
        let tr;
        if (data.data[i].history[j].situation === "buy") {
          let profitPercentFont = data.data[i].history[j].profitPercent
          if (profitPercentFont[0] !== "-") {
            tr = $('<tr>').attr('class', `detail${i + 1}`).append(
              $("<td>").attr('class', 'number').css("background-color", c).append(`${j + 1}`),
              $("<td>").attr('class', 'date').css("background-color", c).append(data.data[i].history[j].information),
              $("<td>").attr('class', 'situation').css("background-color", c).append(data.data[i].history[j].situation),
              $("<td>").attr('class', 'count').css("background-color", c).append(data.data[i].history[j].stock),
              $("<td>").attr('class', 'value').css("background-color", c).append(data.data[i].history[j].value),
              $("<td>").attr('class', 'cost').css("background-color", c).append(data.data[i].history[j].tradeCost),
              $("<td>").attr('class', 'property').css("background-color", c).append(data.data[i].history[j].property),
              $("<td>").attr('class', 'profit').css("background-color", c).css("color", r).append(data.data[i].history[j].profitPercent),
            );
          } else {
            tr = $('<tr>').attr('class', `detail${i + 1}`).append(
              $("<td>").attr('class', 'number').css("background-color", c).append(`${j + 1}`),
              $("<td>").attr('class', 'date').css("background-color", c).append(data.data[i].history[j].information),
              $("<td>").attr('class', 'situation').css("background-color", c).append(data.data[i].history[j].situation),
              $("<td>").attr('class', 'count').css("background-color", c).append(data.data[i].history[j].stock),
              $("<td>").attr('class', 'value').css("background-color", c).append(data.data[i].history[j].value),
              $("<td>").attr('class', 'cost').css("background-color", c).append(data.data[i].history[j].tradeCost),
              $("<td>").attr('class', 'property').css("background-color", c).append(data.data[i].history[j].property),
              $("<td>").attr('class', 'profit').css("background-color", c).css("color", g).append(data.data[i].history[j].profitPercent),
            );
          }

        } else {
          let profitPercentFont = data.data[i].history[j].profitPercent
          if (profitPercentFont[0] !== "-") {
            tr = $('<tr>').attr('class', `detail${i + 1}`).append(
              $("<td>").attr('class', 'number').append(`${j + 1}`),
              $("<td>").attr('class', 'date').append(data.data[i].history[j].information),
              $("<td>").attr('class', 'situation').append(data.data[i].history[j].situation),
              $("<td>").attr('class', 'count').append(data.data[i].history[j].stock),
              $("<td>").attr('class', 'value').append(data.data[i].history[j].value),
              $("<td>").attr('class', 'cost').append(data.data[i].history[j].tradeCost),
              $("<td>").attr('class', 'property').append(data.data[i].history[j].property),
              $("<td>").attr('class', 'profit').css("color", r).append(data.data[i].history[j].profitPercent),
            );
          } else {
            tr = $('<tr>').attr('class', `detail${i + 1}`).append(
              $("<td>").attr('class', 'number').append(`${j + 1}`),
              $("<td>").attr('class', 'date').append(data.data[i].history[j].information),
              $("<td>").attr('class', 'situation').append(data.data[i].history[j].situation),
              $("<td>").attr('class', 'count').append(data.data[i].history[j].stock),
              $("<td>").attr('class', 'value').append(data.data[i].history[j].value),
              $("<td>").attr('class', 'cost').append(data.data[i].history[j].tradeCost),
              $("<td>").attr('class', 'property').append(data.data[i].history[j].property),
              $("<td>").attr('class', 'profit').css("color", g).append(data.data[i].history[j].profitPercent),
            );
          }
        }
        tbody.append(tr)
      }
      table.append(tbody)

      $(".testResult").append(table)
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
      let earningRateFont = (data.data[i].summary.earningRate).toString()
      if (earningRateFont[0] !== "-") {
        let inputCheck = $("<input>").attr('class', `save${i + 1}`).attr("type", "checkbox").attr("value", `case${i+1}`)
        let tr = $('<tr>').attr('class', `summaryData${i + 1}`).append(
          $("<td>").attr('class', 'case').append(`case #${i + 1}`),
          $("<td>").attr('class', 'code').append(data.data[i].case.code),
          $("<td>").attr('class', 'date').append(data.data[i].case.startDate + "</br>" + "~" + "</br>" + data.data[i].case.endDate),
          $("<td>").attr('class', 'qty').append(data.data[i].summary.finalStock),
          $("<td>").attr('class', 'qty').append(data.data[i].summary.stockValue),
          $("<td>").attr('class', 'income').append(data.data[i].summary.tradeCost),
          $("<td>").attr('class', 'cost').append(data.data[i].summary.totalAssets),
          $("<td>").attr('class', 'property').append(data.data[i].summary.income),
          $("<td>").attr('class', 'profit').css("color", r).append(data.data[i].summary.earningRate),
          $("<td>").attr('class', 'save').append(inputCheck)
        );
        $(".summaryData").append(tr)
      } else {
        let inputCheck = $("<input>").attr('class', `save${i + 1}`).attr("type", "checkbox")
        let tr = $('<tr>').attr('class', `summaryData${i + 1}`).append(
          $("<td>").attr('class', 'case').append(`case #${i + 1}`),
          $("<td>").attr('class', 'code').append(data.data[i].case.code),
          $("<td>").attr('class', 'date').append(data.data[i].case.startDate + "</br>" + "~" + "</br>" + data.data[i].case.endDate),
          $("<td>").attr('class', 'qty').append(data.data[i].summary.finalStock),
          $("<td>").attr('class', 'qty').append(data.data[i].summary.stockValue),
          $("<td>").attr('class', 'income').append(data.data[i].summary.tradeCost),
          $("<td>").attr('class', 'cost').append(data.data[i].summary.totalAssets),
          $("<td>").attr('class', 'property').append(data.data[i].summary.income),
          $("<td>").attr('class', 'profit').css("color", g).append(data.data[i].summary.earningRate),
          $("<td>").attr('class', 'save').append(inputCheck)
        );
        $(".summaryData").append(tr)
      }

    }

    // $(".summary").append(summaryNum)

  } else {



  }
}

backTestResult();

function option() { 
  window.location.replace('../option.html')
}
function backTest() { 
  window.location.replace('../backTest.html')
 }

// getData();

if (localStorage.getItem("userToken")) {
  const data = {
    token: localStorage.getItem("userToken"),
  };
  fetch("api/1.0/user/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((body) => {
      if (body.error) {
        swal("登入逾時，請重新登入", {
          buttons: {
            cancel: "不要!",
            catch: {
              text: "好哦!",
              value: "catch",
            },
          },
        }).then((value) => {
          switch (value) {
            case "catch":
              window.location.replace("../signin.html");
              break;

            default:
              window.location.replace("../index.html");
          }
        });
      } else {
        $(".memberLink").attr("href", "./profile.html");
        $(".member").text(`${body.name}`);
      }
    });
} else {
  swal("請登入會員，激活此功能", {
    buttons: {
      cancel: "不要!",
      catch: {
        text: "好哦!",
        value: "catch",
      },
    },
  }).then((value) => {
    switch (value) {
      case "catch":
        window.location.replace("../signin.html");
        break;

      default:
        window.location.replace("../index.html");
    }
  });
}

function save(){
  alert("Coming soon !!")
}

function again() {
  window.location.replace('../backTest.html')
}

$(".search").on("keypress", function (e) {
  if (e.key === "Enter") {
    let code = $(".search").val();
    localStorage.setItem("homeCode", code)
    window.location.replace("../basic.html");
  }
});

function pageCheck() {
  localStorage.setItem("page", "profile");
  window.location.replace("../profile.html");
}