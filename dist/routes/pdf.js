"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdfController = require('../controller/pdf');
const router = express_1.Router();
router.post('/pdf', pdfController.postPdf);
module.exports = router;
