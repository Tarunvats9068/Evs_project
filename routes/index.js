const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const homeController = require('../controllers/homeController.js');
const passport = require('passport');
module.exports = router;
router.get('/',homeController.home);
router.post('/create',homeController.create);
router.get('/sign_up',homeController.sign_up);
router.get('/login',homeController.login);
router.post('/login_form',passport.authenticate('local',{failureRedirect:'/login'}),homeController.login_form);
router.get('/otp',homeController.otp);
router.post('/otp_verify',homeController.otp_verify);
router.get('/forgot',homeController.forgot);
router.post('/forgot_password',homeController.forgot_password);
router.get('/set_password',homeController.setpassword);
router.post('/update_password',homeController.update_password);
router.post('/forms_contact',homeController.form_contact);