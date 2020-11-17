"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
exports.postPdf = (req, res, next) => {
    const document = new pdfkit_1.default();
    document.pipe(fs_1.default.createWriteStream('./docs/test.pdf'));
    document.text(`${req.body.name}`, 100, 100);
    document.text(`${req.body.subject}`);
    document.text(`${req.body.adress}`);
    document.text(`${req.body.postcode}`);
    document.text(`${req.body.city}`);
    document.end();
    console.log('PDF created!');
    res.status(200).json({ message: 'PDF' });
};
