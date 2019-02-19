const express = require('express');
const router = express.Router();
const checkAuth = require('../auth/check-auth');

const userController = require('../controllers/users');

router.post('/signup', userController.signUp);

router.post('/login', userController.login);

router.delete('/:userId', checkAuth, userController.deleteUser);

router.get('/validate', checkAuth, (req, res)=>{
    res.send({success: true, email: req.userData.email});
});

module.exports = router;