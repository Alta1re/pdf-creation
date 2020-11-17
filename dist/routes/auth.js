"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = require('../controller/auth');
const router = express_1.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login);
module.exports = router;
