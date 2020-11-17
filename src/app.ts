import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const mongoName = process.env.MONGO_NAME;

const pdfRoutes = require('./routes/pdf');
const authRoutes = require('./routes/auth');

const app = express();

app.use('/docs', express.static('docs'));
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);
	next();
});

app.use(authRoutes);
app.use(pdfRoutes);

app.use((error: any, req: any, res: any, next: any) => {
	const status = error.statusCode || 500;
	const message = error.msg;
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

mongoose
	.connect(
		`mongodb://${mongoUser}:${mongoPass}@server.hager-web.com:27017/${mongoName}?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(result => {
		app.listen(5050);
		console.log('Server listen at port: 5050');
	})
	.catch(err => console.log(err));
