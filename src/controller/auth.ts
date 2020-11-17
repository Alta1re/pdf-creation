import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

const User = require('../models/user');

exports.signup = (req: any, res: any, next: () => void) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed!');

		throw error;
	}
	const email = req.body.email;
	const password = req.body.password;
	const name = req.body.name;
	const status = req.body.status;
	bcrypt
		.hash(password, 12)
		.then(hashedPw => {
			const user = new User({
				email: email,
				password: hashedPw,
				name: name,
				status: status
			});
			return user.save();
		})
		.then(result => {
			res.status(201).json({
				message: 'User created.'
			});
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next();
		});
};

exports.login = async (req: any, res: any, next: () => void) => {
	const email = req.body.email;
	const password = req.body.password;
	const user = await User.findOne({ email: email });
	if (!user) {
		const error = new Error('User not found!');
		//error.statusCode = 401;
		//error.data({ message: 'Can´t find user with this email.' });
		throw error;
	}
	const passwordMatch = await bcrypt.compare(password, user.password);
	if (!passwordMatch) {
		const error = new Error('Authentication failed!');
		//error.statusCode = 401;
		//error.data({ message: 'Password doesn´t match.' });
		throw error;
	}
	const token = jwt.sign(
		{ userId: user._id.toString() },
		'mega!super?secure!safety?secret!'
	);
	res.status(200).json({ token: token, userId: user._id.toString() });
};
