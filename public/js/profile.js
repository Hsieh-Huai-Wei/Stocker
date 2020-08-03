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
        }).then((result) => {
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
        console.log("OK")
        $(".memberLink").attr("href", "./profile.html");
        $(".member").text(`${body.name}`);
        $(".name").text(`${body.name}`);
        $(".email").text(`${body.email}`)
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
    } else {
      window.location.replace("../index.html");
    }
  });
}

function option() { 
  window.location.replace('../option.html')
}
function backTest() { 
  window.location.replace('../backTest.html')
 }

function profile() {
  $("#profile").css("color", "#ffffff")
  $("#profile").css("border-bottom-color", "#ffffff");
}

profile();

function overview() {
  alert("Coming soon !!")
}
function record() {
  alert("Coming soon !!");
}
function details() {
  alert("Coming soon !!");
}
function profit() {
  alert("Coming soon !!");
}
function backtest() {
  alert("Coming soon !!");
}

$(".search").on("keypress", function (e) {
  if (e.key === "Enter") {
    let code = $(".search").val();
    localStorage.setItem("homeCode", code)
    window.location.replace("../basic.html");
  }
});