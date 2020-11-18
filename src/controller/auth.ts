import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import ValidationException from '../exceptions/ValidationException';
import { NextFunction } from 'express';

const User = require('../models/user');

interface AuthError extends Error {
	statusCode: number;
	data: { message: string };
}

exports.signup = (req: any, res: any, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed!');

		throw error;
	}
	const email = req.body.email;
	const password = req.body.password;
	const name = req.body.name;
	const status = 0;
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
			next(err);
		});
};

exports.login = async (req: any, res: any, next: NextFunction) => {
	const email = req.body.email;
	const password = req.body.password;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			const error: ValidationException = new ValidationException(
				422,
				'User not found!'
			);
			throw error;
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			const error: ValidationException = new ValidationException(
				401,
				'Password wrong.'
			);

			throw error;
		}
		const token = jwt.sign(
			{ userId: user._id.toString() },
			'mega!super?secure!safety?secret!'
		);
		res.status(200).json({ token: token, userId: user._id.toString() });
	} catch (error) {
		next(error);
	}
};
