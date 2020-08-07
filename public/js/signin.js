/* global $ Swal*/
const signUpButton = $('#signUp');
const signInButton = $('#signIn');
const overlayLeft = $('.overlay-left');
const overlayRight = $('.overlay-right');

async function fetchPostData(url, data) {
  let res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  return res.json();
}

// nav function
async function getData() {
  if ($('.search').val() !== '') {
    window.location.replace(`/basic.html?stock=${$('.search').val()}`);
  }
}

$('.search').on('keypress', function (e) {
  if (e.key === 'Enter') {
    getData();
  }
});

// main function
signUpButton.on('click', () => {
  overlayLeft.css('display', 'block');
  overlayRight.css('display', 'none');
});

signInButton.on('click', () => {
  overlayRight.css('display', 'block');
  overlayLeft.css('display', 'none');
});

async function signUp () {
  let name = $('.signUpName').val();
  let email = $('.signUpEmail').val();
  let pwd = $('.signUpPwd').val();

  const data = {
    name: name,
    email: email,
    pwd: pwd,
  };

  Swal.fire({
    icon: 'info',
    title: '資料註冊中，請稍後!',
    timerProgressBar: true,
    allowOutsideClick: false,
    onBeforeOpen: async () => {
      Swal.showLoading();
      let url = 'api/1.0/user/signup';
      let body = await fetchPostData(url, data);
      if (body.error) {
        await Swal.fire({
          icon: 'error',
          title: body.error,
          showConfirmButton: true,
        }).then(() => {
          window.location.replace('/signin.html');
        });
        return;
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
    },
  });
}

async function signIn () {
  let email = $(".signInEmail").val();
  let pwd = $(".signInPwd").val();

  const data = {
    email: email,
    pwd: pwd,
  };

  Swal.fire({
    icon: 'info',
    title: '會員資料確認中，請稍後!',
    timerProgressBar: true,
    allowOutsideClick: false,
    onBeforeOpen: async () => {
      Swal.showLoading();
      let url = 'api/1.0/user/signin';
      let body = await fetchPostData(url, data)
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
    },
  });

}

// init function
function checkPage() {
  window.localStorage.setItem('page', 'profile');
  window.location.replace('../profile.html');
}