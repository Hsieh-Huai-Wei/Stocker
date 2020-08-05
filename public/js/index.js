/* global  $ Swal*/
// const { con } = require("../../util/dbcon");

window.localStorage.setItem('page', 'index');

function userCheck() {
  if (window.localStorage.getItem('userToken')) {
    const data = {
      token: window.localStorage.getItem('userToken'),
    };
    fetch('api/1.0/user/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.error) {
          $('.memberLink').attr('href', './signin.html');
          $('.member').text('Sign up / Log in');
        } else {
          console.log(body);
          $('.memberLink').attr('href', './profile.html');
          $('.member').text(`${body.name}`);
        }
      });
  } else {
    $('.memberLink').attr('href', './signin.html');
    $('.member').text('Sign up / Log in');
  }
}

userCheck();



function checkAuth(num) {
  if ($('.member').text() === 'Sign up / Log in') {
    Swal.fire({
      title: '請登入會員，激活此功能',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '好哦!',
      cancelButtonText: '不要!',
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value) {
        window.location.replace('../signin.html');
      } else {
        window.location.replace('../index.html');
      }
    });
  } else if (num === 1) {
    window.location.replace('../option.html');
  } else {
    window.location.replace('../backTest.html');
  }
}

function pageCheck() {
  window.localStorage.setItem('page', 'profile');
  window.location.replace('../profile.html');
}