"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.default = ValidationException;
