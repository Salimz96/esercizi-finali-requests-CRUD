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
exports.db = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const db = (0, pg_promise_1.default)()("postgres://postgres:1234@localhost:5432/planetsdb");
exports.db = db;
//poi si scrive la funzione setup di DB:
const setupDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.none(`DROP TABLE IF EXISTS planets;`);
    yield db.none(`CREATE TABLE planets(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT 
    );
    
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
id SERIAL NOT NULL PRIMARY KEY,
username TEXT NOT NULL,
password TEXT NOT NULL,
token TEXT 
)

    `);
    yield db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
    yield db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
    yield db.none(`INSERT INTO users (username, password) VALUES ('dummy', 'dummy')`);
    const planets = yield db.many(`SELECT * FROM planets;`);
    console.log(planets);
});
setupDB();
//# sourceMappingURL=db.js.map