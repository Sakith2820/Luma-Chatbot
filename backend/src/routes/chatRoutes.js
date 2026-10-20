import { Router } from 'express'
import { postChat } from '../controllers/chatController.js'
import { validateChatRequest } from '../middleware/validateChatRequest.js'

const router = Router()

router.post('/chat', validateChatRequest, postChat)

export default router
