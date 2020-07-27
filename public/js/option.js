// GET DATA
function filterData() {

  // let newHigh;
  // console.log(document.getElementById('newHigh').checked)
  // if (document.getElementById('newHigh').checked) {
  //   newHigh = 1;
  // } else {
  //   newHigh = 0;
  // }

  let newHigh = 1;

  // let searchStartDay = $('.searchStartDay ').val();
  // let searchEndDay = $('.searchEndDay ').val();
  let searchStartDay = "2020-01-01";
  let searchEndDay = "2020-07-31";
  let upperPrice = 1000;
  let lowerPrice = 0;
  let graph = "test";
  let countDay = 20;
  let upDay = 5;
  let downDay = 5;
  let upPrice = 12;
  let downPrice = 15;
  let rank = 10;
  let cross = 1;
  let consolidate = 9;
  let cycle = 1;
  let continuousRed = 6;

  // let searchStartDay = $('.searchStartDay ').val();
  // let searchEndDay = $('.searchEndDay ').val();
  // let upperPrice = 1000;
  // let lowerPrice = 0;
  // let graph = "island";
  // let countDay = 20;
  // let upDay = 4;
  // let downDay = 4;
  // let upPrice = 12;
  // let downPrice = 15;
  // let rank = 10;
  // let cross = 1;
  // let consolidate = 7;
  // let cycle = 1;
  // let continuousRed = 6;

  let userFilter = {
    start: searchStartDay,
    end: searchEndDay,
    upper: upperPrice,
    lower: lowerPrice,
    graph: graph,
    count: countDay,
    upDay: upDay,
    downDay: downDay,
    increase: upPrice,
    decrease: downPrice,
    rank: rank,
    High: newHigh,
    cross: cross,
    consolidate: consolidate,
    cycle: cycle,
    continuousRed: continuousRed,
  }
  let choiceDates = searchEndDay.split('-')[0] + searchEndDay.split('-')[1] + searchEndDay.split('-')[2];
  localStorage.setItem('filterDate', choiceDates);
  console.log(userFilter)

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