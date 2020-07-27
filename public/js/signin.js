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
    name: "琦玉老師",
    email: "onePunchMan@test.com",
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
        alert(body.msg);
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
    email: "onePunchMan@test.com",
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
        alert(body.msg);
      } else {
        const token = body.data.access_token;
        localStorage.setItem("userToken", token);
        window.location.replace("/profile.html");
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