// GET DATA
function filterData() {

  let searchEndDay="";
  let countDays = "";
  let increase = "";
  let decrease = "";

  if ($("#countDays").val() === "") {
    countDays = "25"
  } else {
    countDays = $("#countDays").val();
  }

  if ($(".searchEndDay").val()==="") {
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
    searchEndDay = ey + "-" + em + "-" + ed;
  } else {
    searchEndDay = $(".searchEndDay").val();
  }

  if ($(".upperPrice").val() === "") {
    upperPrice = "1000"
  } else {
    upperPrice = $(".upperPrice").val();
  }

  if ($(".lowerPrice").val() === "") {
    lowerPrice = "100"
  } else {
    lowerPrice = $(".lowerPrice").val();
  }

  if ($("#increase").val() === "") {
    increase = "5"
  } else {
    increase = $("#increase").val();
  }

  if ($("#decrease").val() === "") {
    decrease = "5"
  } else {
    decrease = $("#decrease").val();
  }

  let graph = $("input:checked").val();

  let y = Number(searchEndDay.split('-')[0]);
  let m = searchEndDay.split('-')[1];
  let d = searchEndDay.split('-')[2];
  y = y - 1 
  let searchStartDay = `${y}` + "-" + `${m}` + "-" + `${d}`;


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
  console.log(userFilter)

  let choiceDates = searchEndDay.split('-')[0] + searchEndDay.split('-')[1] + searchEndDay.split('-')[2];
  localStorage.setItem('filterDate', choiceDates);

  // let alerts = $("<div>").attr("class", "alters").css("text-align", "center").css("margin-top", "20px").text("Calculating...");
  $(".submit").val("計算中").attr("disabled", true).css("width", "94px").css("background-color", "#f15e5e")

  fetch(`api/1.0/option2`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(userFilter),
  }).then((res) => res.json())
    .then((body) => {
      if (body.data.length === 0) {
        $(".alters").remove()
        alert("無相符的股票，請重新選擇條件");
        $(".submit").val("送出").attr("disabled", false)
      } else {
        let data = JSON.stringify(body)
        localStorage.setItem('optionResult', data);
        window.location.replace('/filter.html');
      }
    });
}

function option() {
  window.location.replace('../option.html')
}
function backTest() {
  window.location.replace('../backTest.html')
}

$(".search").on("keypress", function (e) {
  if (e.key === "Enter") {
    let code = $(".search").val();
    localStorage.setItem("homeCode", code)
    window.location.replace("../basic.html");
  }
});

// NAV GET DATA
// async function getData() {
//   if ($(".search").val() !== "") {
//     let code = $(".search").val();
//     localStorage.setItem("homeCode", code);
//     let startDate =""
//     let endDate =""

//     if (code === "") {
//       code = "2330";
//     }

//     let userSearch = {
//       stockCode: code,
//       startDate: startDate,
//       endDate: endDate,
//     };

//     fetch(`api/1.0/singleStock`, {
//       method: "POST",
//       headers: new Headers({
//         "Content-Type": "application/json",
//       }),
//       body: JSON.stringify(userSearch),
//     })
//       .then((res) => res.json())
//       .then((body) => {
//         if (body.error) {
//           alert(body.error);
//           return;
//         }
//         for (let i = 0; i < body.data.length; i++) {
//           let strDate = body.data[i].date.toString();
//           let y = strDate[0] + strDate[1] + strDate[2] + strDate[3] + "/";
//           let m = strDate[4] + strDate[5] + "/";
//           let d = strDate[6] + strDate[7];
//           body.data[i].date = new Date(y + m + d);
//         }

//         let datas = JSON.stringify(body.data);
//         localStorage.setItem("home", datas);
//         window.location.replace("/index.html")
//       });

//   } else {
//     return;
//   }
// }


// function graphCheck () {
//   let radioValue = $("input:checked").val();

//   if (radioValue === "reverseV") {
//     if ($(".reverseV").children().length < 3) {
//       $(".increase").remove()
//       $(".decrease").remove()
//       $("#increase").remove()
//       $("#decrease").remove()
//       $(".countDays").remove()
//       $("#countDays").remove()
//       let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
//       let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
//       $(".reverseV").append(countDays)
//       $(".reverseV").append(inputs)
//     }  
//   } else if (radioValue === "uptrend") {
//     if ($(".uptrend").children().length < 3) {
//       $(".countDays").remove()
//       $("#countDays").remove()
//       $(".decrease").remove()
//       $("#decrease").remove()
//       let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
//       let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
//       let input = $("<input>").attr("id", "increase").attr("type", "text").attr("placeholder", "ex. 5")
//       let increase = $("<div>").attr("id", "itemss").attr("class", "increase").text("上漲 %")
//       $(".uptrend").append(countDays)
//       $(".uptrend").append(inputs)
//       $(".uptrend").append(increase)
//       $(".uptrend").append(input)
//     }
//   } else if (radioValue === "downtrend") {
//     if ($(".downtrend").children().length < 3) {
//       $(".countDays").remove()
//       $("#countDays").remove()
//       $(".increase").remove()
//       $("#increase").remove()
//       let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
//       let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
//       let input = $("<input>").attr("id", "decrease").attr("type", "text").attr("placeholder", "ex. 5")
//       let decrease = $("<div>").attr("id", "itemss").attr("class", "decrease").text("下跌 %")
//       $(".downtrend").append(countDays)
//       $(".downtrend").append(inputs)
//       $(".downtrend").append(decrease)
//       $(".downtrend").append(input)
//     }
//   } else {
//     $(".countDays").remove()
//     $("#countDays").remove()
//     $(".increase").remove()
//     $(".decrease").remove()
//     $("#increase").remove()
//     $("#decrease").remove()
//   } 
// }

// graphCheck();

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


function graphCheck() {
  let radioValue = $("input:checked").val();
  let optional = $("<div>").attr("class", "optional")
  if (radioValue === "reverseV") {
    $(".optional").remove()
    let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
    let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
    optional.append(countDays)
    optional.append(inputs)
    $(".dif").append(optional)
  } else if (radioValue === "uptrend") {
    $(".optional").remove()
    let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
    let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
    let input = $("<input>").attr("id", "increase").attr("type", "text").attr("placeholder", "ex. 5")
    let increase = $("<div>").attr("id", "itemss").attr("class", "increase").text("上漲 %")
    optional.append(countDays)
    optional.append(inputs)
    optional.append(increase)
    optional.append(input)
    $(".dif").append(optional)
  } else if (radioValue === "downtrend") {
    $(".optional").remove()
    let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
    let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
    let input = $("<input>").attr("id", "decrease").attr("type", "text").attr("placeholder", "ex. 5")
    let decrease = $("<div>").attr("id", "itemss").attr("class", "decrease").text("下跌 %")
    optional.append(countDays)
    optional.append(inputs)
    optional.append(decrease)
    optional.append(input)
    $(".dif").append(optional)
  } else {
    $(".optional").remove()
    $(".dif").append(optional)
  }
}

graphCheck();