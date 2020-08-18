// require
require('dotenv').config();
const { NODE_ENV, PORT, PORT_TEST, API_VERSION} = process.env;
const port = NODE_ENV == 'test' ? PORT_TEST : PORT;
const schedule = require('node-schedule');
// Express Initialization
const express = require('express');
const app = express();

app.set('json spaces', 2);

// crawel function
const crawel = require('./script/dailyCrawel');
schedule.scheduleJob('0 30 12 * * *', crawel.runDailyCrawler);

// let body converted to JSON
app.use(express.static(__dirname + '/public'));
app.use('/admin', express.static('public'));
app.use(express.json()); // the same with bodyparser json

// CORS Control
app.use('/api/', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.set('Access-Control-Allow-Credentials', 'true');
  next();
});


// API routes
app.use('/api/' + API_VERSION, [
  require('./server/routes/save_route'),
  require('./server/routes/stock_route'),
  require('./server/routes/user_route'),
]);

// 404 page
app.get('*', (req, res) => {
  res.redirect('/404.html');
});

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.log(err.message);
  res.json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});

module.exports = app;
