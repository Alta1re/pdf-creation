"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ValidationException_1 = __importDefault(require("../exceptions/ValidationException"));
const User = require('../models/user');
exports.signup = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed!');
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const status = 0;
    bcryptjs_1.default
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
exports.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = yield User.findOne({ email: email });
        if (!user) {
            const error = new ValidationException_1.default(422, 'User not found!');
            throw error;
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            const error = new ValidationException_1.default(401, 'Password wrong.');
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, 'mega!super?secure!safety?secret!');
        res.status(200).json({
            token: token,
            id: user._id.toString(),
            name: user.name
        });
    }
    catch (error) {
        next(error);
    }
});
