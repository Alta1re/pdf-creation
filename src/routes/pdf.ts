import { Router } from 'express';
const pdfController = require('../controller/pdf');

const router = Router();

router.post('/pdf', pdfController.postPdf);

module.exports = router;
