import express from 'express';
const router =express.Router();
import UserController from '../controllers/usercontroller.js';
import checkUserAuth from '../middlewares/auth-middleware.js';


//Route level middle  for protecting routes

router.use('/changepassword',checkUserAuth)
router.use('/loggeduser', checkUserAuth)


//Public Routes 

router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/sendresetuserpasswordemail', UserController.sendUserPasswordResetEmail)
router.post('/resetpassword/:id/:token', UserController.userPasswordReset)

//Private Routes

router.post('/changepassword', UserController.changeUserPassword)
router.get('/loggeduser', UserController.loggedUser)  //for retrieving data only



export default router 