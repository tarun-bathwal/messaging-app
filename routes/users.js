const express = require('express');
const router = express.Router();
const Users= require('../controllers/user');
const checkAuth=require('../middlewares/check-auth');

router.post('/register',Users.register);
router.get('/verify',Users.verify);
router.post('/login',Users.login);
router.put('/block/:username',checkAuth,Users.blockuser);
router.post('/sendmessage',checkAuth,Users.SendMessage);
router.get('/inbox',checkAuth,Users.inbox)
module.exports = router;
