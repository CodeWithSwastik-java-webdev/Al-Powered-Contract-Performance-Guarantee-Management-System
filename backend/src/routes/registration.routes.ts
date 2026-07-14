import { Router } from 'express'
import { asyncHandler } from '../utils'
import { registrationController } from '../controllers'
import { authenticate, verifyFirebaseToken } from '../middleware'

const router = Router()

// Public create (can use verifyFirebaseToken to ensure the caller has a Firebase token)
router.post('/', verifyFirebaseToken, asyncHandler(registrationController.create.bind(registrationController)))

// Admin / reviewer routes (require auth)
router.get('/', authenticate, asyncHandler(registrationController.list.bind(registrationController)))
router.get('/:id', authenticate, asyncHandler(registrationController.getById.bind(registrationController)))
router.post('/:id/comment', authenticate, asyncHandler(registrationController.addComment.bind(registrationController)))
router.put('/:id/status', authenticate, asyncHandler(registrationController.updateStatus.bind(registrationController)))

export default router
