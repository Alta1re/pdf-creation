import { Router } from 'express';
const authController = require('../controller/auth');

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;
