const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/AuthController');
const profileController = require('../Controllers/profileController');

router.post('/login' , AuthController.login);

router.put('/updateProfile', profileController.updateProfile);
router.post('/createProfile' , profileController.createProfile);
router.post('/updateProfileWithNumber', profileController.updateProfileWithNumber);
router.get('/getProfile/:id', profileController.getProfile);

router.post('/signup', AuthController.signup);
router.delete('/deleteUsers', AuthController.clearAllUsers);
router.delete('/deleteProfiles', AuthController.clearAllProfiles);

module.exports = router;