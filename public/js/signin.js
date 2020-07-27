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