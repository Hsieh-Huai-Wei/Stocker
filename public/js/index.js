localStorage.setItem("page", "index")

function userCheck() {
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
          $(".memberLink").attr("href", "./signin.html");
          $(".member").text(`Sign up / Log in`);
        } else {
          console.log(body);
          $(".memberLink").attr("href", "./profile.html");
          $(".member").text(`${body.name}`);
        }
      });
  } else {
    $(".memberLink").attr("href", "./signin.html");
    $(".member").text(`Sign up / Log in`);
  }
}

userCheck()



function checkAuth(num) {
  if ($(".member").text() === `Sign up / Log in`) {
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
      }
    });
  } else if (num === 1) {
    window.location.replace("../option.html");
  } else {
    window.location.replace("../backTest.html");
  }
}

function pageCheck() {
  localStorage.setItem("page", "profile");
  window.location.replace("../profile.html");
}

// let timerInterval;

// Swal.fire({
//   title: "Auto close alert!",
//   html: "I will close in <b></b> milliseconds.",
//   // timer: 2000,
//   timerProgressBar: true,
//   allowOutsideClick: false,
//   onBeforeOpen: () => {
//     Swal.showLoading();
//     timerInterval = setInterval(() => {
//       const content = Swal.getContent();
//       if (content) {
//         const b = content.querySelector("b");
//         if (b) {
//           b.textContent = Swal.getTimerLeft();
//         }
//       }
//     }, 100);
//   },
//   onClose: () => {
//     clearInterval(timerInterval);
//   },
// }).then((result) => {
//   /* Read more about handling dismissals below */
//   if (result.dismiss === Swal.DismissReason.timer) {
//     console.log("I was closed by the timer");
//   }
// });