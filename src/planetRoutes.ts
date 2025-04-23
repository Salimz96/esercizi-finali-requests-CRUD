import express from 'express';

import morgan from 'morgan';
import 'express-async-errors'; // Gestione errori async
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById, createImage
} from "./controllers/planets.js";
import multer from "multer";

const storage= multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({storage})

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use("/uploads", express.static("uploads")); 



// Rotta GET per ottenere tutti i pianeti tramite router.get
app.get('/api/planets', getAll );

  // Rotta GET per ottenere un pianeta tramite ID (:id)
app.get('/api/planets/:id', getOneById );

  // Rotta POST per creare un nuovo pianeta
app.post('/api/planets', create);

  // Rotta PUT per aggiornare un pianeta
app.put('/api/planets/:id', updateById);

 // Rotta DELETE per eliminare un pianeta
app.delete('/api/planets/:id', deleteById );
  
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Errore:', err.message);
    res.status(500).json({ error: 'Errore interno del server' });
  });

  app.post("/api/planets/:id/image", upload.single("image"), createImage );


  
  app.listen(PORT, () => {
    console.log(` Server in ascolto su http://localhost:${PORT}`);
  });

  export default app; 