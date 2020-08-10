/* global  $ Swal app*/
window.localStorage.setItem('page', 'index');

app.fetchPostData = async function (url, data) {
  let res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  return res.json();
};

app.checkAuth = async function (num) {
  if ($('.member').text() === 'Sign up / Log in') {
    let result = await Swal.fire({
      title: '請登入會員，激活此功能',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '好哦!',
      cancelButtonText: '不要!',
      reverseButtons: true,
      allowOutsideClick: false,
    });
    if (result.value) {
      window.location.replace('../signin.html');
    } else {
      window.location.replace('../index.html');
    }
  } else if (num === 1) {
    window.location.replace('../option.html');
  } else {
    window.location.replace('../backTest.html');
  }
};

// init function
app.checkUser = async function () {
  if (window.localStorage.getItem('userToken')) {
    const data = {
      token: window.localStorage.getItem('userToken'),
    };
    let url = 'api/1.0/user/profile';
    let body = await app.fetchPostData(url, data);
    if (body.error) {
      $('.memberLink').attr('href', './signin.html');
      $('.member').text('Sign up / Log in');
    } else {
      $('.memberLink').attr('href', './profile.html');
      $('.member').text(`${body.name}`);
    }
  } else {
    $('.memberLink').attr('href', './signin.html');
    $('.member').text('Sign up / Log in');
  }
};

app.checkPage = function () {
  window.localStorage.setItem('page', 'profile');
  window.location.replace('../profile.html');
};

app.checkUser();