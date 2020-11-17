import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		status: {
			type: Number,
			required: false
		}
	},
	{ timestamps: true }
);
module.exports = mongoose.model('User', userSchema);
