import { Router } from 'express'
import { asyncHandler } from '../utils'
import { registrationController } from '../controllers'
import { authenticate, verifyFirebaseToken, requireRoles, validate } from '../middleware'
import { createRegistrationSchema, updateRegistrationStatusSchema } from '../validators'

const router = Router()

// Public create (can use verifyFirebaseToken to ensure the caller has a Firebase token)
router.post('/', verifyFirebaseToken, validate(createRegistrationSchema), asyncHandler(registrationController.create.bind(registrationController)))

// Admin / reviewer routes (require auth)
router.get('/', authenticate, requireRoles('ADMIN'), asyncHandler(registrationController.list.bind(registrationController)))
router.get('/:id', authenticate, requireRoles('ADMIN'), asyncHandler(registrationController.getById.bind(registrationController)))
router.post('/:id/comment', authenticate, requireRoles('ADMIN'), asyncHandler(registrationController.addComment.bind(registrationController)))
router.put('/:id/status', authenticate, requireRoles('ADMIN'), validate(updateRegistrationStatusSchema), asyncHandler(registrationController.updateStatus.bind(registrationController)))

export default router
