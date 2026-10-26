import { Router } from 'express'
import {
  getDocumentStatus,
  uploadDocument,
} from '../controllers/documentController.js'

const router = Router()

router.get('/status', getDocumentStatus)
router.post('/index', uploadDocument)

export default router
