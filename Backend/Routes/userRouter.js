const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/AuthController');
const profileController = require('../Controllers/profileController');

router.post('/login' , AuthController.login);

router.post('/updateProfile', profileController.updateProfile);
router.post('/createProfile' , profileController.createProfile);
router.post('/updateProfileWithNumber', profileController.updateProfileWithNumber);

router.post('/signup', AuthController.signup);

module.exports = router;