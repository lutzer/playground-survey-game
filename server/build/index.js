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
const express_1 = __importDefault(require("express"));
const logger_1 = require("./logger");
const path_1 = require("path");
const pg_1 = require("pg");
const config_1 = require("./config");
const lodash_1 = __importDefault(require("lodash"));
const PORT = process.env.PORT || 8080;
const API_PATH = '/api';
const STATIC_WEB_DIR = path_1.resolve(__dirname, '../public');
const DATABASE_TABLE = 'results';
const DATABASE_URL = process.env.DATABASE_URL || config_1.config.connectionString;
function getDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg_1.Client({
            connectionString: DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        });
        yield client.connect();
        //check if table exists, else create it
        try {
            yield client.query(`SELECT * FROM ${DATABASE_TABLE};`);
        }
        catch (err) {
            yield client.query(`CREATE TABLE ${DATABASE_TABLE} ( 
      id SERIAL PRIMARY KEY,
      data jsonb NOT NULL
    );`);
        }
        return client;
    });
}
const app = express_1.default();
exports.app = app;
// SERVE STATIC FILES
app.use(express_1.default.static(STATIC_WEB_DIR));
app.use(express_1.default.json());
const validateData = function (data) {
    if (!lodash_1.default.has(data, 'tiles'))
        throw new Error("Data does not contain tiles data");
    if (!lodash_1.default.has(data, 'avatar'))
        throw new Error("Data does not contain avatar");
    if (!lodash_1.default.has(data, 'playgroundType'))
        throw new Error("Data does not contain playground type");
    if (!lodash_1.default.has(data, 'missing'))
        throw new Error("Data does not contain playground missing");
    if (!lodash_1.default.has(data, 'version'))
        throw new Error("Data does not contain version");
    if (!lodash_1.default.has(data, 'seed'))
        throw new Error("Data does not contain seed");
    return lodash_1.default.pick(data, ['tiles', 'avatar', 'playgroundType', 'missing', 'version', 'seed']);
};
// POST SURVEY RESULT
app.post(`${API_PATH}/results`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('new result received');
    try {
        validateData(req.body);
        const db = yield getDatabase();
        yield db.query(`INSERT INTO ${DATABASE_TABLE} (data) VALUES ($1)`, [JSON.stringify(req.body)]);
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
        const db = yield getDatabase();
        const results = yield db.query(`SELECT * from ${DATABASE_TABLE}`);
        res.send(results.rows);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.sendStatus(400);
    }
}));
app.listen(PORT, () => {
    logger_1.logger.info(`Server is running at http://localhost:${PORT}`);
});
