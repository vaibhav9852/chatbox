import express from 'express';
import { getUsers , getUser, updateUser} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/multerUpload.middleware';

const router = express.Router();

router.get('/',authenticate , getUsers)   
 
 router.get('/:id', getUser)
 
 router.patch('/:id',upload.fields([{name:'avatar',maxCount:1}]), updateUser) 

export default router;       
                     