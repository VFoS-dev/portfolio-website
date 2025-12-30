const express = require('express');
const { direct } = require('../_helper/misc');
const { login, changePassword, verifyToken } = require('../controller/authController');
const { authenticateToken } = require('../_helper/auth');
const router = express.Router();

router.post('/login', direct(login));
router.post('/verify', direct(verifyToken));
router.post('/change-password', authenticateToken, (req, res, next) => {
  const data = {
    ...req.body,
    userId: req.user._id,
  };
  changePassword(data).then(({ status = 200, ...send } = {}) => {
    res.status(status).send(send);
    next();
  }).catch(error => {
    res.status(500).send({ message: error.message });
    next();
  });
});

module.exports = router;

