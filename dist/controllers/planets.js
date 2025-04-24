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
exports.createImage = exports.deleteById = exports.updateById = exports.create = exports.getOneById = exports.getAll = void 0;
const joi_1 = __importDefault(require("joi"));
const db_js_1 = require("./../db.js");
/* type Planet = { //si sposta il database nel file sotto controllers
    id: number;
    name: string;
  };
  
  
  let planets: Planet[] = [
    { id: 1, name: 'Earth' },
    { id: 2, name: 'Mars' }
  ];
 */
const planetSchema = joi_1.default.object({
    name: joi_1.default.string().required()
});
const createSchema = joi_1.default.object({
    id: joi_1.default.number().max(99).required(),
    name: joi_1.default.string().min(3).max(20).required()
});
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const planets = yield db_js_1.db.any(`SELECT * FROM planets;`);
    res.status(200).json(planets);
});
exports.getAll = getAll;
const getOneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const planet = yield db_js_1.db.any(`SELECT * FROM planets WHERE id=$1;`, Number(id));
    /* const planet = planets.find(p => p.id === Number(id)) */
    //qui si gestisce l'errore 
    if (planet !== undefined) {
        res.status(200).json(planet);
    }
    else {
        res.status(404).end("No planet found");
    }
});
exports.getOneById = getOneById;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const newPlanet = { name };
    /*  const newPlanet: Planet = {
      id: planets.length + 1,  // si assegna id incrementale
       name: req.body.name
     }; */
    const validatedNewPlanet = createSchema.validate(newPlanet);
    if (validatedNewPlanet.error) {
        res.status(400).send(validatedNewPlanet.error);
    }
    else {
        /*  planets= [...planets, newPlanet]; //utilizzo dello spread operator */
        yield db_js_1.db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
        res.status(201).json({ msg: 'Planet created successfully' }); //ri restituisce il messaggio di successo della chiamata 
    }
});
exports.create = create;
const updateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    /*  planets = planets.map(p=> p.id === Number(id) ? ({...p, name}) : p) */
    yield db_js_1.db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);
    res.status(200).json({ msg: 'Planet updated successfully' });
});
exports.updateById = updateById;
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield db_js_1.db.none(`DELETE FROM planets WHERE id=$1`, Number(id));
    /* const planetIndex = planets.findIndex(p => p.id === Number(id)); */
    /*  planets.splice(planetIndex, 1);  // Rimuovi il pianeta dal "database" */
    res.status(200).json({ msg: 'Planet deleted successfully' });
});
exports.deleteById = deleteById;
const createImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (fileName) {
        db_js_1.db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, fileName]);
        res.status(201).json({ msg: "Planet image uploaded successfully" });
    }
    else {
        res.status(400).json({ msg: "Planet image failed to upload" });
    }
});
exports.createImage = createImage;
//# sourceMappingURL=planets.js.map