const signUpButton = $('#signUp');
const signInButton = $('#signIn');

const overlayLeft = $(".overlay-left");
const overlayRight = $(".overlay-right");

signUpButton.on('click', () => {
  console.log("signup")
  overlayLeft.css("display", "block");
  overlayRight.css("display", "none");
});

signInButton.on('click', () => {
  console.log("signin");
  overlayRight.css("display", "block");
  overlayLeft.css("display", "none");
});

function signUp () {
  // let name = $(".signUpName").val();
  // let email = $(".signUpEmail").val();
  // let pwd = $(".signUpPwd").val();

  // const data = {
  //   name: name,
  //   email: email,
  //   pwd: pwd,
  // };

  const data = {
    name: "test",
    email: "test@test.com",
    pwd: "123456",
  };

  fetch(`api/1.0/user/signup`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((body) => {
      if (body.status !== undefined) {
        swal(body.msg);
      } else {
        const token = body.data.access_token;
        localStorage.setItem("userToken", token);
        console.log(body)
        window.location.replace("/profile.html");
      }
    });

}

function signIn () {
  // let email = $(".signInEmail").val();
  // let pwd = $(".signInPwd").val();

  // const data = {
  //   email: email,
  //   pwd: pwd,
  // };

  const data = {
    email: "test@test.com",
    pwd: "123456",
  };

  fetch(`api/1.0/user/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((body) => {
      if (body.status !== undefined) {
        swal(body.msg);
      } else {
        
        const token = body.data.access_token;
        localStorage.setItem("userToken", token);
        console.log(localStorage.getItem("page"));
        console.log(localStorage.getItem("page") === "index");
        if (localStorage.getItem("page")) {
          let page = localStorage.getItem("page")
          if (page === "index"){
            window.location.replace("/index.html");
          } else if (page === "basic"){
            window.location.replace("/basic.html");
          } else if (page === "option") {
            window.location.replace("/option.html");
          } else if (page === "filter"){
            window.location.replace("/filter.html");
          } else if (page === "backTest") {
            window.location.replace("/backTest.html");
          } else if (page === "result"){
            window.location.replace("/result.html");
          }
        } else {
          window.location.replace("/profile.html");
        }
      }
    });

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

$(".search").on("keypress", function (e) {
  if (e.key === "Enter") {
    let code = $(".search").val();
    localStorage.setItem("homeCode", code)
    window.location.replace("../basic.html");
  }
});

function pageCheck() {
  localStorage.setItem("page", "profile");
  window.location.replace("../profile.html");
}