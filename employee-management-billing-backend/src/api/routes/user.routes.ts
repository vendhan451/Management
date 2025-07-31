import { Router } from 'express';
import { authenticateJWT, authorizeAdmin, authorizeOwnerOrAdmin } from '../middleware/auth.middleware';
import { createUser, getUserById, updateUser, deleteUser, changePassword, getAllUsers } from '../controllers/user.controller';
import { createUserSchema, updateUserSchema, changePasswordSchema } from '../validators/user.validators';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// User management routes
router.post('/', authenticateJWT, authorizeAdmin, validate(createUserSchema), createUser);
router.get('/:userId', authenticateJWT, authorizeOwnerOrAdmin, getUserById);
router.put('/:userId', authenticateJWT, authorizeOwnerOrAdmin, validate(updateUserSchema), updateUser);
router.delete('/:userId', authenticateJWT, authorizeAdmin, deleteUser);
router.get('/', authenticateJWT, authorizeAdmin, getAllUsers);
router.post('/change-password', authenticateJWT, validate(changePasswordSchema), changePassword);

export default router;
