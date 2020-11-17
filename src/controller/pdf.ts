import PDFDocument from 'pdfkit';
import fs from 'fs';

exports.postPdf = (req: any, res: any, next: () => void) => {
	const document = new PDFDocument();
	document.pipe(fs.createWriteStream('./docs/test.pdf'));
	document.text(`${req.body.name}`, 100, 100);
	document.text(`${req.body.subject}`);
	document.text(`${req.body.adress}`);
	document.text(`${req.body.postcode}`);
	document.text(`${req.body.city}`);

	document.end();

	console.log('PDF created!');
	res.status(200).json({ message: 'PDF' });
};
