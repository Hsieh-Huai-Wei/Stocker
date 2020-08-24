require('dotenv').config();
const { nodeEMAIL, PASS, } = process.env;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: nodeEMAIL,
    pass: PASS,
  }
});

function sendEmail(msg) {
  transporter.sendMail({
    from: 'Raymond <raymondhsieh0116@gmail.com>',
    to: 'Huai Wei <waterman0116@gmail.com>',
    subject: 'Hi :)',
    html: `<h1>Hello</h1><p>${msg}</p>`
  }, function (err) {
    if (err) {
      console.log('Unable to send email: ' + err);
    }
  });
}

module.exports = {
  sendEmail,
};
