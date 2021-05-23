"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const devMode = process.argv.includes('-dev');
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(
    //winston.format.colorize(),
    winston_1.default.format.timestamp(), winston_1.default.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level}] ${message}`;
    })),
    transports: devMode ?
        [new winston_1.default.transports.Console()] :
        [new winston_1.default.transports.Console(), new winston_1.default.transports.File({
                filename: path_1.default.resolve(__dirname, '../logs/server.log'),
                maxsize: 20 * 1024 * 1024
            })]
});
exports.logger = logger;
