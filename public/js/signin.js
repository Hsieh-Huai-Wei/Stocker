/* global $ Swal app*/
const signUpButton = $('#signUp');
const signInButton = $('#signIn');
const overlayLeft = $('.overlay-left');
const overlayRight = $('.overlay-right');

app.fetchPostData = async function (url, data) {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  return res.json();
};

// nav function
app.getData = async function () {
  if ($('.search').val() !== '') {
    window.location.replace(`/basic.html?stock=${$('.search').val()}`);
  }
};

$('.search').on('keypress', function (e) {
  if (e.key === 'Enter') {
    app.getData();
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

app.signUp = async function () {
  const name = $('.signUpName').val();
  const email = $('.signUpEmail').val();
  const pwd = $('.signUpPwd').val();

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
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  });
  const url = 'api/1.0/user/signup';
  const body = await app.fetchPostData(url, data);
  Swal.close();
  if (body.error) {
    await Swal.fire({
      icon: 'error',
      title: body.error,
      showConfirmButton: true,
    });
    window.location.replace('/signin.html');
    return;
  } else {
    const data = JSON.stringify(body);
    window.localStorage.setItem('optionResult', data);
    await Swal.fire({
      icon: 'success',
      title: '註冊成功，即將轉向...',
      showConfirmButton: false,
      timer: 1500,
    });
    const token = body.data.access_token;
    window.localStorage.setItem('userToken', token);
    window.location.replace('/profile.html');
  }
};

app.signIn = async function () {
  const email = $('.signInEmail').val();
  const pwd = $('.signInPwd').val();

  if (email || pwd) {
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
      }
    });
    const url = 'api/1.0/user/signin';
    const body = await app.fetchPostData(url, data);
    Swal.close();
    if (body.status !== undefined) {
      await Swal.fire({
        icon: 'error',
        title: '信箱或密碼填寫錯誤，請重新輸入!',
      });
      return;
    } else {
      const data = JSON.stringify(body);
      window.localStorage.setItem('optionResult', data);
      await Swal.fire({
        icon: 'success',
        title: '登入成功，即將轉向...',
        showConfirmButton: false,
        timer: 1500,
      });
      const token = body.data.access_token;
      window.localStorage.setItem('userToken', token);
      if (window.localStorage.getItem('page')) {
        const page = window.localStorage.getItem('page');
        switch (page) {
          case 'index':
            window.location.replace('/index.html');
            break;
          case 'basic':
            window.location.replace('/basic.html');
            break;
          case 'option':
            window.location.replace('/option.html');
            break;
          case 'filter':
            window.location.replace('/filter.html');
            break;
          case 'backTest':
            window.location.replace('/backTest.html');
            break;
          case 'result':
            window.location.replace('/result.html');
            break;
        }
      } else {
        window.location.replace('/profile.html');
      }
    }
  } else {
    await Swal.fire({
      icon: 'error',
      title: '信箱與密碼不得為空!',
    });
  }
};

// init function
app.checkPage = function () {
  window.localStorage.setItem('page', 'profile');
  window.location.replace('../profile.html');
};