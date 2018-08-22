const express = require('express');
const router = express.Router();
const Users= require('../controllers/user');

router.post('/register',Users.register);
router.get('/verify',Users.verify);
router.post('/login',Users.login);
module.exports = router;
