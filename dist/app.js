"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorMiddelware_1 = __importDefault(require("./middelware/errorMiddelware"));
dotenv_1.default.config();
const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const mongoName = process.env.MONGO_NAME;
const pdfRoutes = require('./routes/pdf');
const authRoutes = require('./routes/auth');
const app = express_1.default();
app.use('/docs', express_1.default.static('docs'));
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(authRoutes);
app.use(pdfRoutes);
app.use(errorMiddelware_1.default);
mongoose_1.default
    .connect(`mongodb://${mongoUser}:${mongoPass}@server.hager-web.com:27017/${mongoName}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
    app.listen(5050);
    console.log('Server listen at port: 5050');
})
    .catch(err => console.log(err));
