function addCase() {
  let num = $("#case").children(".title").length;
  console.log(num)
  let title = $('<div>').attr('class', `title`).text(`BackTest Condition Form - Case #${num + 1}`).append($("<div>").attr('class', `note`));

  let base = $('<div>').attr('class', `base`).append(
    $("<div>").attr('class', `subtitle`).text('Base option'),
    $("<div>").attr('id', `items`).text('Stock Code / Name'),
    $("<input>").attr("type", "text").attr('class', `code${num+1}`),
    $("<div>").attr('id', `items`).text('Start Date'),
    $("<input>").attr("type", "date").attr('class', `searchStartDay${num+1}`),
    $("<div>").attr('id', `items`).text('End Date'),
    $("<input>").attr("type", "date").attr("class", `searchEndDay${num+1}`),
    $("<div>").attr('id', `items`).text('Property'),
    $("<input>").attr("type", "text").attr("class", `property${num+1}`),
    $("<div>").attr('id', `items`).text('Dealer discount'),
    $("<input>").attr("type", "text").attr("class", `discount${num+1}`),
  )

  let advance = $('<div>').attr('class', `advance`).append(
    $("<div>").attr('class', `subtitle`).text('Advance option'),
    $("<div>").attr('id', `items`).attr('class', `graph`).text('Mode Choice'),

    $("<div>").attr('id', `items`).attr('class', `items${num+1}`).append(
      $("<label>").append(`<input type="radio" name="graph${num+1}" value="nomarl" checked>Normal`),
      $("<label>").append(`<input type="radio" name="graph${num+1}" value="macd" disabled/>MACD`),
      $("<label>").append(`<input type="radio" name="graph${num+1}" value="kd" disabled/>KD`),
      $("<label>").append(`<input type="radio" name="graph${num+1}" value="rsi" disabled/>RSI`),
      // $("<label>").append(`<input type="radio" name="graph" value="bias" />BIAS`),
    ),
    $("<div>").attr('id', `items`).text('Condition Order'),
    $("<div>").attr('id', `itemss`).text('Increase(%)'),
    $("<input>").attr("type", "text").attr("class", `increase${num+1}`),
    $("<div>").attr('id', `itemss`).text('Buy'),
    $("<input>").attr("type", "text").attr("class", `buy${num+1}`),
    $("<div>").attr('id', `itemss`).text('Decrease(%)'),
    $("<input>").attr("type", "text").attr("class", `decrease${num+1}`),
    $("<div>").attr('id', `itemss`).text('Sell'),
    $("<input>").attr("type", "text").attr("class", `sell${num+1}`),
  )

  let description = $('<div>').attr('class', `description`).append(
    $("<div>").attr('class', `subtitle`).text('Description'),
    $("<div>").attr('class', `graphNote`),
  )

  let userOption = $("<div>").attr('class', "userOption")
  userOption.append(base).append(advance).append(description);
  $("#case").append(title);
  $("#case").append(userOption);

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
    let graph = $("input:radio[name=graph"+`${i}`+"]:checked").val();
    let increase = $(`.increase${i}`).val();
    let buy = $(`.buy${i}`).val();
    let decrease = $(`.decrease${i}`).val();
    let sell = $(`.sell${i}`).val();
    
    let data = {
      code: code,
      startDate: startDate,
      endDate: endDate,
      property: property,
      graph: graph,
      increase: increase,
      buy: buy,
      decrease: decrease,
      sell: sell,
      discount: discount,
    }
    let index = {
      id: caseNo,
      data: data,
    }
    result.push(index)
  };
  console.log(result);
  // return;
  fetch(`api/1.0/backTest`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(result),
  }).then((res) => res.json())
    .then((body) => {
      let data = JSON.stringify(body)
      localStorage.setItem('backTestToken', data);
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
  $(".member").text(`Sign up / Log in`);
}