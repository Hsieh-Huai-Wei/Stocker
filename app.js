// require
require("dotenv").config();
const express = require("express");
const { PORT, API_VERSION} = process.env;
// const port = 3000;
// const port = 5000;
const bodyParser = require("body-parser");
// const apiVersion = "1.0";

const app = express();

app.set("json spaces", 2);



// let body converted to JSON
app.use(express.static(__dirname + "/public"));
app.use("/admin", express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json({ limit: '1000mb' }));

// API routes
app.use("/api/" + API_VERSION, [
  require("./server/routes/admin_route"),
  require("./server/routes/save_route"),
  require("./server/routes/stock_route"),
  require("./server/routes/user_route"),
]);

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Express is running on http://localhost:${PORT}`);
});

module.exports = app;
