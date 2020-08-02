localStorage.setItem("page", "option");

// GET DATA
async function filterData() {
  let searchEndDay = "";
  let countDays = "";
  let increase = "";
  let decrease = "";

  if ($("#countDays").val() === "") {
    countDays = "25";
  } else {
    countDays = $("#countDays").val();
  }

  if ($(".searchEndDay").val() === "") {
    let today = new Date();
    let ey = today.getFullYear().toString();
    let em = (today.getMonth() + 1).toString();
    if (em.length === 1) {
      em = "0" + em;
    }
    let ed = today.getDate().toString();
    if (ed.length === 1) {
      ed = "0" + ed;
    }
    searchEndDay = ey + "-" + em + "-" + ed;
  } else {
    searchEndDay = $(".searchEndDay").val();
  }

  if ($(".upperPrice").val() === "") {
    upperPrice = "1000";
  } else {
    upperPrice = $(".upperPrice").val();
  }

  if ($(".lowerPrice").val() === "") {
    lowerPrice = "100";
  } else {
    lowerPrice = $(".lowerPrice").val();
  }

  if ($("#increase").val() === "") {
    increase = "5";
  } else {
    increase = $("#increase").val();
  }

  if ($("#decrease").val() === "") {
    decrease = "5";
  } else {
    decrease = $("#decrease").val();
  }

  let graph = $("input:checked").val();

  let y = Number(searchEndDay.split("-")[0]);
  let m = searchEndDay.split("-")[1];
  let d = searchEndDay.split("-")[2];
  y = y - 1;
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
  console.log(userFilter);

  let choiceDates =
    searchEndDay.split("-")[0] +
    searchEndDay.split("-")[1] +
    searchEndDay.split("-")[2];
  localStorage.setItem("filterDate", choiceDates);

  $(".submit")
    .val("計算中")
    .attr("disabled", true)
    .css("width", "94px")
    .css("background-color", "#f15e5e");

Swal.fire({
  icon: "info",
  title: "計算中，請稍後!",
  timerProgressBar: true,
  allowOutsideClick: false,
  onBeforeOpen: () => {
    Swal.showLoading();
    fetch(`api/1.0/option2`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(userFilter),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.data.length === 0) {
          $(".alters").remove();
          Swal.fire("查無相符股票", "請重新選擇條件", "info");
          $(".submit").val("送出").attr("disabled", false);
        } else {
          let data = JSON.stringify(body);
          localStorage.setItem("optionResult", data);
          Swal.fire({
            icon: "success",
            title: "查詢成功，即將轉向...",
            showConfirmButton: false,
            timer: 1500,
            }).then(()=>{
              window.location.replace("/filter.html");
            })
        }
      });
  },
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
        Swal.fire({
            title: "登入逾時，請重新登入",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "好哦!",
            cancelButtonText: "不要!",
            reverseButtons: true,
            allowOutsideClick: false,
          })
          .then((result) => {
            if (result.value) {
              window.location.replace("../signin.html");
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              window.location.replace("../index.html");
            }
          });
      } else {
        $(".memberLink").attr("href", "./profile.html");
        $(".member").text(`${body.name}`);
      }
    });
} else {
  Swal.fire({
    title: "請登入會員，激活此功能",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "好哦!",
    cancelButtonText: "不要!",
    reverseButtons: true,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.value) {
      window.location.replace("../signin.html");
    } else{
      window.location.replace("../index.html");
    }
  });
}


function graphCheck() {
  let radioValue = $("input:checked").val();
  let optional = $("<div>").attr("class", "optional")
  let graphNote = $(".graphNote")
  if (radioValue === "reverseV") {
    $(".optional").remove()
    $(".explain").remove()
    let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
    let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
    let img = $("<img>").attr("class", "explain").attr("src", "../imgs/vTrend.png" )
    optional.append(countDays)
    optional.append(inputs)
    graphNote.append(img)
    $(".dif").append(optional)
  } else if (radioValue === "uptrend") {
    $(".optional").remove()
    $(".explain").remove()
    let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
    let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
    let input = $("<input>").attr("id", "increase").attr("type", "text").attr("placeholder", "ex. 5")
    let increase = $("<div>").attr("id", "itemss").attr("class", "increase").text("上漲 %")
    let img = $("<img>").attr("class", "explain").attr("src", "../imgs/upTrend.png")
    optional.append(countDays)
    optional.append(inputs)
    optional.append(increase)
    optional.append(input)
    graphNote.append(img)
    $(".dif").append(optional)
  } else if (radioValue === "downtrend") {
    $(".optional").remove()
    $(".explain").remove()
    let inputs = $("<input>").attr("id", "countDays").attr("class", "countDays").attr("type", "text").attr("placeholder", "ex. 25")
    let countDays = $("<div>").attr("id", "itemss").attr("class", "countDays").text("圖形區間")
    let input = $("<input>").attr("id", "decrease").attr("type", "text").attr("placeholder", "ex. 5")
    let decrease = $("<div>").attr("id", "itemss").attr("class", "decrease").text("下跌 %")
    let img = $("<img>").attr("class", "explain").attr("src", "../imgs/downTrend.png")
    optional.append(countDays)
    optional.append(inputs)
    optional.append(decrease)
    optional.append(input)
    graphNote.append(img)
    $(".dif").append(optional)
  } else {
    $(".optional").remove()
    $(".explain").remove()
    let img = $("<img>").attr("class", "explain").attr("src", "../imgs/rangeTrend.png")
    graphNote.append(img)
    $(".dif").append(optional)
  }
}

graphCheck();

function pageCheck() {
  localStorage.setItem("page", "profile");
  window.location.replace("../profile.html");
}


function today () {
  let now = new Date();
  let ey = now.getFullYear().toString();
  let em = (now.getMonth() + 1).toString();
  if (em.length === 1) {
    em = "0" + em;
  }
  let ed = now.getDate().toString();
  if (ed.length === 1) {
    ed = "0" + ed;
  }
  searchEndDay = ey + "-" + em + "-" + ed;
  $(".searchEndDay").val(searchEndDay);
}

today()