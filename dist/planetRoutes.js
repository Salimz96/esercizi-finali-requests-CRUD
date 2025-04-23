"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
require("express-async-errors"); // Gestione errori async
const planets_js_1 = require("./controllers/planets.js");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage });
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use("/uploads", express_1.default.static("uploads"));
// Rotta GET per ottenere tutti i pianeti tramite router.get
app.get('/api/planets', planets_js_1.getAll);
// Rotta GET per ottenere un pianeta tramite ID (:id)
app.get('/api/planets/:id', planets_js_1.getOneById);
// Rotta POST per creare un nuovo pianeta
app.post('/api/planets', planets_js_1.create);
// Rotta PUT per aggiornare un pianeta
app.put('/api/planets/:id', planets_js_1.updateById);
// Rotta DELETE per eliminare un pianeta
app.delete('/api/planets/:id', planets_js_1.deleteById);
app.use((err, req, res, next) => {
    console.error('Errore:', err.message);
    res.status(500).json({ error: 'Errore interno del server' });
});
app.post("/api/planets/:id/image", upload.single("image"), planets_js_1.createImage);
app.listen(PORT, () => {
    console.log(` Server in ascolto su http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=planetRoutes.js.map