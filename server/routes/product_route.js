const router = require("express").Router();
const { wrapAsync } = require("../../util/util");

const {
  product,
} = require("../controllers/product_controller");

router.route("/productprice").post(wrapAsync(product));

module.exports = router;
