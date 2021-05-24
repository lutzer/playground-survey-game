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
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const logger_1 = require("./logger");
const path_1 = require("path");
const database_1 = require("./database");
const PORT = process.env.PORT || 8080;
const API_PATH = '/api';
const STATIC_WEB_DIR = path_1.resolve(__dirname, '../public');
const app = express_1.default();
exports.app = app;
// SERVE STATIC FILES
app.use(express_1.default.static(STATIC_WEB_DIR));
app.use(express_1.default.json());
// POST SURVEY RESULT
app.post(`${API_PATH}/results`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('new result received');
    try {
        const validationResult = database_1.getValidator()(req.body);
        if (!validationResult.valid)
            throw new Error(JSON.stringify(validationResult.errors));
        const db = yield database_1.getDatabase();
        yield db.postResult(req.body);
        res.sendStatus(200);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.sendStatus(400);
    }
}));
// GET SURVEY RESULTS
app.get(`${API_PATH}/results`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield database_1.getDatabase();
        const results = yield db.getResults();
        res.send(results);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.sendStatus(400);
    }
}));
app.listen(PORT, () => {
    logger_1.logger.info(`Server is running at http://localhost:${PORT}`);
});
