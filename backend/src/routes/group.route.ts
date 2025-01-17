import { Router } from "express";
import {createGroup , getGroups, getGroup , exitGroup , deleteGroup} from "../controllers/group.controller"
import { authenticate } from "../middleware/auth.middleware";

const router = Router()

router.post('/create',createGroup) 

router.get('/', authenticate ,getGroups) 

router.get('/:groupId',getGroup) 

router.patch('/:groupId/exit',exitGroup)

router.delete('/:groupId',deleteGroup)  

// model casacade delete
 
export default router ;    