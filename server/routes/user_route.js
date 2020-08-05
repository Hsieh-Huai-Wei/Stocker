const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
  signIn,
  signUp,
  getUserProfile,
  graphView,
} = require('../controllers/user_controller');

router.route('/user/signin').post(wrapAsync(signIn));
router.route('/user/signup').post(wrapAsync(signUp));
router.route('/user/profile').post(wrapAsync(getUserProfile));

router.route('/user/graphView').get(wrapAsync(graphView));

module.exports = router;