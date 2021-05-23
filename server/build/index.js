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
const express_1 = __importDefault(require("express"));
const logger_1 = require("./logger");
const lowdb_1 = __importDefault(require("lowdb"));
const FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
const path_1 = require("path");
const PORT = process.env.PORT || 8080;
const API_PATH = '/api';
const DATA_FILE = path_1.resolve(__dirname, '../data/data.json');
const STATIC_WEB_DIR = path_1.resolve(__dirname, '../public');
function getDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const adapter = new FileSync_1.default(DATA_FILE);
        const db = lowdb_1.default(adapter);
        yield db.defaults({ results: [] }).write();
        return db;
    });
}
const app = express_1.default();
// SERVE STATIC FILES
app.use(express_1.default.static(STATIC_WEB_DIR));
app.use(express_1.default.json());
// POST SURVEY RESULT
app.post(`${API_PATH}/results`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield getDatabase();
    db.get('results').push(req.body).write();
    logger_1.logger.info('new result received');
    res.sendStatus(200);
}));
// GET SURVEY RESULTS
app.get(`${API_PATH}/results`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield getDatabase();
    const results = db.get('results');
    res.send(results.value());
}));
app.listen(PORT, () => {
    logger_1.logger.info(`Server is running at http://localhost:${PORT}`);
});
