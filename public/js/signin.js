/* global $ Swal*/
const signUpButton = $('#signUp');
const signInButton = $('#signIn');

const overlayLeft = $('.overlay-left');
const overlayRight = $('.overlay-right');

signUpButton.on('click', () => {
  console.log('signup');
  overlayLeft.css('display', 'block');
  overlayRight.css('display', 'none');
});

signInButton.on('click', () => {
  console.log('signin');
  overlayRight.css('display', 'block');
  overlayLeft.css('display', 'none');
});

function signUp () {
  let name = $('.signUpName').val();
  let email = $('.signUpEmail').val();
  let pwd = $('.signUpPwd').val();

  const data = {
    name: name,
    email: email,
    pwd: pwd,
  };

  // const data = {
  //   name: "test",
  //   email: "test@test.com",
  //   pwd: "123456",
  // };

  Swal.fire({
    icon: 'info',
    title: '資料註冊中，請稍後!',
    timerProgressBar: true,
    allowOutsideClick: false,
    onBeforeOpen: () => {
      Swal.showLoading();
      fetch('api/1.0/user/signup', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((body) => {
          if (body.status !== undefined) {
            Swal.fire({
              icon: 'error',
              title: '信箱或密碼填寫錯誤，請重新輸入!',
            });
          } else {
            let data = JSON.stringify(body);
            window.localStorage.setItem('optionResult', data);
            Swal.fire({
              icon: 'success',
              title: '註冊成功，即將轉向...',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              const token = body.data.access_token;
              window.localStorage.setItem('userToken', token);
              window.location.replace('/profile.html');
            });
          }
        });
    },
  });

}

function signIn () {
  // let email = $(".signInEmail").val();
  // let pwd = $(".signInPwd").val();

  // const data = {
  //   email: email,
  //   pwd: pwd,
  // };
  console.log("KOK")
  const data = {
    email: 'test@test.com',
    pwd: '123456',
  };

  Swal.fire({
    icon: 'info',
    title: '會員登入中，請稍後!',
    timerProgressBar: true,
    allowOutsideClick: false,
    onBeforeOpen: () => {
      Swal.showLoading();
      fetch('api/1.0/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((body) => {
          if (body.status !== undefined) {
            console.log(body.msg);
            Swal.fire({
              icon: 'error',
              title: '信箱或密碼填寫錯誤，請重新輸入!',
            });
          } else {
            let data = JSON.stringify(body);
            window.localStorage.setItem('optionResult', data);
            Swal.fire({
              icon: 'success',
              title: '登入成功，即將轉向...',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              const token = body.data.access_token;
              window.localStorage.setItem('userToken', token);
              if (window.localStorage.getItem('page')) {
                let page = window.localStorage.getItem('page');
                if (page === 'index') {
                  window.location.replace('/index.html');
                } else if (page === 'basic') {
                  window.location.replace('/basic.html');
                } else if (page === 'option') {
                  window.location.replace('/option.html');
                } else if (page === 'filter') {
                  window.location.replace('/filter.html');
                } else if (page === 'backTest') {
                  window.location.replace('/backTest.html');
                } else if (page === 'result') {
                  window.location.replace('/result.html');
                } else {
                  window.location.replace('/profile.html');
                }
              } else {
                window.location.replace('/profile.html');
              }
            });
          }
        });
    },
  });

}

$('.search').on('keypress', function (e) {
  if (e.key === 'Enter') {
    let code = $('.search').val();
    window.localStorage.setItem('homeCode', code);
    window.location.replace('../basic.html');
  }
});

function pageCheck() {
  window.localStorage.setItem('page', 'profile');
  window.location.replace('../profile.html');
}