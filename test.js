// 日期選擇

if (isNaN(userSearch.startDate) && isNaN(userSearch.endDate)) {
  let endString = moment().format("YYYY/MM/DD"); //string
  let end = endString.split('/')[0] + endString.split('/')[1] + endString.split('/')[2]
  const start = moment([endString]).subtract(33, "days").format("YYYYMMDD");
  userSearch.startDate = parseInt(start);
  userSearch.endDate = parseInt(end);

} else if (isNaN(userSearch.startDate) && !(isNaN(userSearch.endDate))) {
  const end = userSearch.endDate
  const endString = end.toString()
  let endcount = endString[0] + endString[1] + endString[2] + endString[3] + '/' + endString[4] + endString[5] + '/' + endString[6] + endString[7]

  const start = moment([endcount]).subtract(63, "days").format("YYYYMMDD");
  userSearch.startDate = parseInt(start);
  userSearch.endDate = parseInt(end);
} else if (!(isNaN(userSearch.startDate)) && isNaN(userSearch.endDate)) {
  const endString = moment().format("YYYYMMDD"); //string
  const end = Number(endString)
  const startUser = userSearch.startDate
  const startSting = startUser.toString();
  let startcount = startSting[0] + startSting[1] + startSting[2] + startSting[3] + '/' + startSting[4] + startSting[5] + '/' + startSting[6] + startSting[7];
  const start = Number(moment([startcount]).add(-28, "days").format("YYYYMMDD"));
  userSearch.startDate = parseInt(start);
  userSearch.endDate = parseInt(end);
} else {
  const startUser = userSearch.startDate
  const startSting = startUser.toString();
  let startcount = startSting[0] + startSting[1] + startSting[2] + startSting[3] + '/' + startSting[4] + startSting[5] + '/' + startSting[6] + startSting[7];
  const start = Number(moment([startcount]).add(-28, "days").format("YYYYMMDD"));
  const end = userSearch.endDate
  userSearch.startDate = parseInt(start);
  userSearch.endDate = parseInt(end);
}


// 圖形切換

// NAV GET DATA
async function getData() {
  if ($(".search").val() !== "") {
    let code = $(".search").val();
    localStorage.setItem("homeCode", code);
    let startDate =""
    let endDate =""

    if (code === "") {
      code = "2330";
    }

    let userSearch = {
      stockCode: code,
      startDate: startDate,
      endDate: endDate,
    };

    fetch(`api/1.0/singleStock`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(userSearch),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.error) {
          alert(body.error);
          return;
        }
        for (let i = 0; i < body.data.length; i++) {
          let strDate = body.data[i].date.toString();
          let y = strDate[0] + strDate[1] + strDate[2] + strDate[3] + "/";
          let m = strDate[4] + strDate[5] + "/";
          let d = strDate[6] + strDate[7];
          body.data[i].date = new Date(y + m + d);
        }

        let datas = JSON.stringify(body.data);
        localStorage.setItem("home", datas);
        window.location.replace("/index.html")
      });

  } else {
    return;
  }
}


function graphCheck () {
  let radioValue = $("input:checked").val();

  if (radioValue === "reverseV") {
    if ($(".reverseV").children().length < 3) {
      $(".increase").remove()
      $(".decrease").remove()
      $("#increase").remove()
      $("#decrease").remove()
      $(".countDays").remove()
      $("#countDays").remove()
      let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
      let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
      $(".reverseV").append(countDays)
      $(".reverseV").append(inputs)
    }  
  } else if (radioValue === "uptrend") {
    if ($(".uptrend").children().length < 3) {
      $(".countDays").remove()
      $("#countDays").remove()
      $(".decrease").remove()
      $("#decrease").remove()
      let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
      let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
      let input = $("<input>").attr("id", "increase").attr("type", "text").attr("placeholder", "ex. 5")
      let increase = $("<div>").attr("id", "itemss").attr("class", "increase").text("上漲 %")
      $(".uptrend").append(countDays)
      $(".uptrend").append(inputs)
      $(".uptrend").append(increase)
      $(".uptrend").append(input)
    }
  } else if (radioValue === "downtrend") {
    if ($(".downtrend").children().length < 3) {
      $(".countDays").remove()
      $("#countDays").remove()
      $(".increase").remove()
      $("#increase").remove()
      let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
      let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
      let input = $("<input>").attr("id", "decrease").attr("type", "text").attr("placeholder", "ex. 5")
      let decrease = $("<div>").attr("id", "itemss").attr("class", "decrease").text("下跌 %")
      $(".downtrend").append(countDays)
      $(".downtrend").append(inputs)
      $(".downtrend").append(decrease)
      $(".downtrend").append(input)
    }
  } else {
    $(".countDays").remove()
    $("#countDays").remove()
    $(".increase").remove()
    $(".decrease").remove()
    $("#increase").remove()
    $("#decrease").remove()
  } 
}

graphCheck();