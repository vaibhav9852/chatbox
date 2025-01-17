import express from 'express';
import { signup, login , githubLogin, verifyEmail, forgotPassword, resetPassword  } from '../controllers/auth.controller';
import passport from '../middleware/passport.middleware';
import { upload } from '../middleware/multerUpload.middleware';
import { userSignupSchema , userSigninSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/user.schema';
import { validateData } from '../middleware/zodValidation.middleawre';

const router = express.Router(); 

router.post('/signup', upload.fields([{name:'avatar',maxCount:1}]), signup); 
router.post('/verify-email/:token', verifyEmail); 
router.post('/login', validateData(userSigninSchema), login);      
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',  passport.authenticate('github', { failureRedirect: '/login' }), githubLogin )
router.post('/forgot-password',validateData(forgotPasswordSchema) ,forgotPassword)    
router.post('/reset-password/:token' ,validateData(resetPasswordSchema), resetPassword)    
export default router;     
                        