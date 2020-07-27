// GET DATA
function filterData() {


  let searchStartDay = $(".searchStartDay").val();
  let searchEndDay = $(".searchEndDay").val();
  let upperPrice = $(".upperPrice").val();
  let lowerPrice = $(".lowerPrice").val();
  let graph = $("input:checked").val();
  let countDay = $(".countDay").val();
  let increase = $(".increase").val();
  let decrease = $(".decrease").val();

  if (searchEndDay === "" || upperPrice === "" || lowerPrice === "") {
    alert("你484有資料沒填寫RRRR!!!");
    return;
  } else if (graph === "reverseV") {
    if (countDay==="") {
      alert("你484有資料沒填寫RRRR!!!");
      return;
    }
  } else if (graph === "uptrend") {
    if (countDay === "" || increase === "") {
      alert("你484有資料沒填寫RRRR!!!");
      return;
    }
  } else if (graph === "downtrend") {
    if (countDay === "" || lowerPrice === "") {
      alert("你484有資料沒填寫RRRR!!!");
      return;
    }
  }

  if (graph !== "na") {
    let y = Number(searchEndDay.split('-')[0]);
    let m = searchEndDay.split('-')[1];
    let d = searchEndDay.split('-')[2];
    y = y - 1 
    searchStartDay = `${y}` + "-" + `${m}` + "-" + `${d}`;
  }

  let userFilter = {
    start: searchStartDay,
    end: searchEndDay,
    upper: upperPrice,
    lower: lowerPrice,
    graph: graph,
    count: countDay,
    increase: increase,
    decrease: decrease,
  };


  let choiceDates = searchEndDay.split('-')[0] + searchEndDay.split('-')[1] + searchEndDay.split('-')[2];
  localStorage.setItem('filterDate', choiceDates);
  console.log(userFilter)

  let alerts = $("<div>").attr("class", "alters").css("text-align", "center").css("margin-top", "20px").text("Calculating...");
  $(".description").append(alerts)

  fetch(`api/1.0/option2`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(userFilter),
  }).then((res) => res.json())
    .then((body) => {
      console.log(body);

      let data = JSON.stringify(body)
      localStorage.setItem('optionResult', data);
      window.location.replace('/filter.html');
    });
}

function option() {
  window.location.replace('../option.html')
}
function backTest() {
  window.location.replace('../backTest.html')
}

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
        $(".member").text(`Sign up / Log in`);
      } else {
        console.log(body);
        $(".member").text(`${body.name}`);
      }
    });
}

function graphCheck () {
  let radioValue = $("input:checked").val();

  if (radioValue === "reverseV") {
    $(".searchStartDay").val("");
    $(".countDay").val("");
    $(".countDay").attr("disabled", false);
    $(".increase").val("NA");
    $(".increase").attr("disabled", true);
    $(".decrease").val("NA");
    $(".decrease").attr("disabled", true);
    $(".searchStartDay").attr("disabled", true);
  } else if (radioValue === "uptrend") {
    $(".searchStartDay").val("");
    $(".countDay").val("");
    $(".countDay").attr("disabled", false);
    $(".increase").val("");
    $(".increase").attr("disabled", false);
    $(".decrease").val("NA");
    $(".decrease").attr("disabled", true);
    $(".searchStartDay").attr("disabled", true);
  } else if (radioValue === "downtrend") {
    $(".searchStartDay").val("");
    $(".countDay").val("");
    $(".countDay").attr("disabled", false);
    $(".increase").val("NA");
    $(".increase").attr("disabled", true);
    $(".decrease").val("");
    $(".decrease").attr("disabled", false);
    $(".searchStartDay").attr("disabled", true);
  } else {
    $(".countDay").val("NA");
    $(".countDay").attr("disabled", true);
    $(".increase").val("NA");
    $(".increase").attr("disabled", true);
    $(".decrease").val("NA");
    $(".decrease").attr("disabled", true);
    $(".searchStartDay").attr("disabled", false);
  } 
}

graphCheck();