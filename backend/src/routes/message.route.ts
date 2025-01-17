import { Router } from "express";
import { addMessage ,getMessage,getGroupMessage} from "../controllers/message.controller"
import { upload } from "../middleware/multerUpload.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { getMessageSchema , getGroupMessageSchema,createMessageSchema } from "../schemas/message.schema";
import { validateData } from "../middleware/zodValidation.middleawre";

 
const router = Router() 

 router.post('/' ,upload.fields([{name:'file',maxCount:1}]) , addMessage)

 router.get('/:recipientId', validateData(getMessageSchema) ,getMessage )    

 router.get('/group/:groupId' ,validateData(getGroupMessageSchema), getGroupMessage)      
 
export default router       