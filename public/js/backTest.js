function addCase() {

  let num = $("#case").children(".title").length;
  console.log(num)
  if (num<5) {

    let title = $('<div>').attr('class', `title`).text(`歷史回測條件單 #${num + 1}`).append($("<div>").attr('class', `note`));

    let base = $('<div>').attr('class', `base`).append(
      $("<div>").attr('class', `subtitle`).text('基本設定'),
      $("<div>").attr('class', `items`).text('股票名稱/代碼'),
      $("<input>").attr("type", "text").attr('class', `code${num + 1}`).attr("placeholder", "ex. 2330"),
      $("<div>").attr('class', `items`).text('開始日期'),
      $("<input>").attr("type", "date").attr('class', `searchStartDay${num + 1}`),
      $("<div>").attr('class', `items`).text('結束日期'),
      $("<input>").attr("type", "date").attr("class", `searchEndDay${num + 1}`),
      $("<div>").attr('class', `items`).text('資金(單位:千)'),
      $("<input>").attr("type", "text").attr("class", `property${num + 1}`).attr("placeholder", "ex. 100000"),
      $("<div>").attr('class', `items`).text('券商折扣(%)'),
      $("<input>").attr("type", "text").attr("class", `discount${num + 1}`).attr("placeholder", "ex. 40"),
    )

    let inputIncreaseBuy = $("<input>").attr("class", `increase${num + 1}`).attr("name", `increase${num + 1}`).attr("type", "radio").attr("value", "buy").add("<div>"+"買"+"</div>");
    let inputIncreaseSell = $("<input>").attr("class", `increase${num + 1}`).attr("name", `increase${num + 1}`).attr("type", "radio").attr("value", "sell").add("<div>" + "賣" + "</div>");
    let inputDecreaseBuy = $("<input>").attr("class", `decrease${num + 1}`).attr("name", `decrease${num + 1}`).attr("type", "radio").attr("value", "buy").add("<div>" + "買" + "</div>");
    let inputDecreaseSell = $("<input>").attr("class", `decrease${num + 1}`).attr("name", `decrease${num + 1}`).attr("type", "radio").attr("value", "sell").add("<div>" + "賣" + "</div>");

    inputIncreaseSell.attr("checked", "checked")
    inputDecreaseBuy.attr("checked", "checked")

    let advance = $('<div>').attr('class', `advance`).append(
      $("<div>").attr('class', `subtitle`).text('交易策略'),
      $("<div>").attr('class', `itemss`).text('上漲(%)'),
      $("<input>").attr("type", "text").attr("class", `increase${num + 1}`).attr("placeholder", "ex. 5"),

      $("<div>").attr('class', `itemss increase${num + 1}`).append(inputIncreaseBuy).append(inputIncreaseSell),

      $("<input>").attr("type", "text").attr("class", `increaseText${num + 1}`).attr("name", `increase`).attr("placeholder", "ex. 5"),

      $("<div>").attr('class', `itemss`).text('下跌(%)'),
      $("<input>").attr("type", "text").attr("class", `decrease${num + 1}`).attr("placeholder", "ex. 3"),

      $("<div>").attr('class', `itemss decrease${num + 1}`).append(inputDecreaseBuy).append(inputDecreaseSell),

      $("<input>").attr("type", "text").attr("class", `decreaseText${num + 1}`).attr("name", `decrease`).attr("placeholder", "ex. 1"),

    )

    let userOption = $("<div>").attr('class', "userOption")
    userOption.append(base).append(advance)
    $("#case").append(title);
    $("#case").append(userOption);
  } else {
    $(".add").text("超過新增上限").attr("disabled", true).css("width", "94px").css("background-color", "#f15e5e")
  }
}

addCase();

function test() {
  let num = $("#case").children(".title").length;

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
    
    let increaseAct = $(`.increase${i}:checked`).val()
    let increase = $(`.increase${i}`).val();
    let increaseCount = $(`.increaseText${i}`).val();
    let decreaseAct = $(`.decrease${i}:checked`).val()
    let decrease = $(`.decrease${i}`).val();
    let decreaseCount = $(`.decreaseText${i}`).val();
    
    // let caseNo = `case1`;
    // let code = "1101";
    // let startDate = "20190101"
    // let endDate = "20200701"
    // let property = 10000;
    // let discount = 40;
    // let graph = $("input:radio[name=graph" + `${i}` + "]:checked").val();
    // let increaseAct = "sell"
    // let increase = 5;
    // let increaseCount = 5;
    // let decreaseAct = "buy"
    // let decrease = 3;
    // let decreaseCount = 3;

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
    }
    let index = {
      id: caseNo,
      data: data,
    }
    result.push(index)
  };
  $(".test").text("計算中").attr("disabled", true).css("width", "94px").css("background-color", "#f15e5e")
  // console.log(result)
  fetch(`api/1.0/backTest`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(result),
  }).then((res) => res.json())
    .then((body) => {
      console.log(body)
      let data = JSON.stringify(body)
      localStorage.setItem('backTestToken', data);
      // return;
      window.location.replace('/result.html');
    });
}

function option() { 
  window.location.replace('../option.html')
}
function backTest() { 
  window.location.replace('../backTest.html')
}


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
        alert("登入逾時，請重新登入");
        window.location.replace("/signin.html");
      } else {
        console.log(body);
        $(".member").text(`${body.name}`);
      }
    });
} else {
  alert("請登入會員")
  window.location.replace("/signin.html");
}


// function check() {
//   if () {
//     let a = $(".increaseBuys").val()
//     console.log(a)
//   } else {
//     let a = $(".increaseSell").val()
//     console.log(a)
//   }
// }

// if (document.getElementById('increaseBuy').checked) {
//   console.log("buy")
// } else if (document.getElementById('increaseSell').checked) {
//   console.log("sell")
// }

$(".search").on("keypress", function (e) {
  if (e.key === "Enter") {
    let code = $(".search").val();
    localStorage.setItem("homeCode", code)
    window.location.replace("../basic.html");
  }
});