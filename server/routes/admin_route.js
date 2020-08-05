const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
  historyprice,
} = require('../controllers/admin_controller');

router.route('/user/graphView').get(wrapAsync(historyprice));

module.exports = router;
