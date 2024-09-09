import express from 'express';
const router = express.Router();


import { login, logout, register, uploadMedia, getProfileById, searchAccount, updateProfile } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
// import { uploadFile } from '../middlewares/multer.js';



// Routes

router.post('/uploadFile', uploadMedia)

router.post('/register', register);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.get('/profile/:id', isAuthenticated, getProfileById);
router.put('/updateProfile', isAuthenticated, updateProfile);
router.get('/search', isAuthenticated, searchAccount);





export default router;