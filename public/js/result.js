function backTestResult() {
  if (localStorage.getItem('backTestToken')) {
    let data = JSON.parse(localStorage.getItem('backTestToken'))
    console.log(data);
    console.log(data.data.length);
    console.log(data.data[0].case);
    console.log(data.data[0].history);
    console.log(data.data[0].summary);
    console.log(data.data[0].history.length);
    console.log(data.data[0].history[0]);
    console.log(data.data[0].history[0].profitPercent);
    console.log(typeof data.data[0].history[0].profitPercent);
    console.log(data.data[0].summary.earningRate);
    console.log(typeof data.data[0].summary.earningRate);

    for (let i = 0; i < data.data.length; i++) {
      let tr = $('<tr>').attr('class', `detail`).append(
        $("<th>").attr('class', 'number').text("#"),
        $("<th>").attr('class', 'date').text("Date"),
        $("<th>").attr('class', 'situation').text("Trade"),
        $("<th>").attr('class', 'count').text("Count"),
        $("<th>").attr('class', 'value').text("Value"),
        $("<th>").attr('class', 'cost').text("Cost"),
        $("<th>").attr('class', 'property').text("Property"),
        $("<th>").attr('class', 'profit').text("profit"),
      );
      let caseNum = $('<table>').attr('class', `case`).text(`case ${i + 1}`).append(tr)
      for (let j = 0; j < data.data[i].history.length; j++) {
        let tr = $('<tr>').attr('class', `detail`).append(
          $("<th>").attr('class', 'number').append("<p>" + `${j + 1}` + "</p>"),
          $("<th>").attr('class', 'date').append("<p>" + data.data[i].history[j].information + "</p>"),
          $("<th>").attr('class', 'situation').append("<p>" + data.data[i].history[j].situation + "</p>"),
          $("<th>").attr('class', 'count').append("<p>" + data.data[i].history[j].stock + "</p>"),
          $("<th>").attr('class', 'value').append("<p>" + data.data[i].history[j].value + "</p>"),
          $("<th>").attr('class', 'cost').append("<p>" + data.data[i].history[j].tradeCost + "</p>"),
          $("<th>").attr('class', 'property').append("<p>" + data.data[i].history[j].property + "</p>"),
          $("<th>").attr('class', 'profit').append("<p>" + data.data[i].history[j].profitPercent + "</p>"),
        );
        caseNum.append(tr)
      }

      $(".testResult").append(caseNum)
    }

    let tr = $('<tr>').attr('class', `detail`).append(
      $("<th>").attr('class', 'case').text(`Case #`),
      $("<th>").attr('class', 'qty').text("Stock qty"),
      $("<th>").attr('class', 'income').text("Income"),
      $("<th>").attr('class', 'cost').text("Trade cost"),
      $("<th>").attr('class', 'property').text("Property"),
      $("<th>").attr('class', 'profit').text("Profit"),
      $("<th>").attr('class', 'save').text("Save"),
    );

    let summaryNum = $('<table>').attr('class', `detail`).append(tr)

    for (let i = 0; i < data.data.length; i++) {
      let tr = $('<tr>').attr('class', `detail`).append(
        $("<th>").attr('class', 'case').append("<p>" + `case #${i + 1}` + "</p>"),
        $("<th>").attr('class', 'qty').append("<p>" + data.data[i].summary.finalStock + "</p>"),
        $("<th>").attr('class', 'income').append("<p>" + data.data[i].summary.income + "</p>"),
        $("<th>").attr('class', 'cost').append("<p>" + data.data[i].summary.tradeCost + "</p>"),
        $("<th>").attr('class', 'property').append("<p>" + data.data[i].summary.totalAssets + "</p>"),
        $("<th>").attr('class', 'profit').append("<p>" + data.data[i].summary.earningRate + "</p>"),
        $("<input>").attr('class', 'save').attr("type", "checkbox")
      );
      summaryNum.append(tr)
    }

    $(".summary").append(summaryNum)

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
function kBar() { }
function line() { }
function finance() { }
function news() { }
function information() { }

getData();