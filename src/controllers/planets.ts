import {Request, Response} from "express";
import Joi from 'joi';
import pgPromise from "pg-promise";
import {db} from "./../db.js"


/* type Planet = { //si sposta il database nel file sotto controllers
    id: number;
    name: string;
  };
  
  
  let planets: Planet[] = [
    { id: 1, name: 'Earth' },
    { id: 2, name: 'Mars' }
  ];
 */
  const planetSchema = Joi.object({ 
    name: Joi.string().required()  
  });

  const createSchema = Joi.object({
    id: Joi.number().max(99).required(),
    name: Joi.string().min(3).max(20).required()
  });

  const getAll= async (req: Request, res: Response) => {
    const planets= await db.any(`SELECT * FROM planets;`)
    res.status(200).json(planets);
  }

  const getOneById= async (req: Request, res: Response) => {
    const {id}= req.params;
    const planet = await db.any(`SELECT * FROM planets WHERE id=$1;`, Number(id))
    /* const planet = planets.find(p => p.id === Number(id)) */

    //qui si gestisce l'errore 
    if (planet !== undefined) {
        res.status(200).json(planet);
    } else {
        res.status(404).end("No planet found")
    }
  
  }


  const create= async (req: Request, res: Response) => {

    const {name} = req.body;
    const newPlanet = {name};

   /*  const newPlanet: Planet = {
     id: planets.length + 1,  // si assegna id incrementale 
      name: req.body.name
    }; */
    const validatedNewPlanet = createSchema.validate(newPlanet)
    if(validatedNewPlanet.error) {
        res.status(400).send(validatedNewPlanet.error)
    } else {
       /*  planets= [...planets, newPlanet]; //utilizzo dello spread operator */
       await db.none(`INSERT INTO planets (name) VALUES ($1)`, name)
    res.status(201).json({ msg: 'Planet created successfully' }); //ri restituisce il messaggio di successo della chiamata 
    }
  
  }

  const updateById= async (req: Request, res: Response) => {
    const {id}= req.params;
    const {name}= req.body;
  /*  planets = planets.map(p=> p.id === Number(id) ? ({...p, name}) : p) */
  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name])
   
   
    res.status(200).json({ msg: 'Planet updated successfully' });
  }
  const deleteById= async (req: Request, res: Response) => {
    const {id}= req.params;

    await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));
  
    /* const planetIndex = planets.findIndex(p => p.id === Number(id)); */
   /*  planets.splice(planetIndex, 1);  // Rimuovi il pianeta dal "database" */
    res.status(200).json({ msg: 'Planet deleted successfully' });
  }

  const createImage = async(req: Request, res: Response) => {

    const {id}= req.params;
    const fileName= req.file?.path;

    if (fileName) {
      db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, fileName]);
      res.status(201).json({msg: "Planet image uploaded successfully"})
    } else {
      res.status(400).json({msg: "Planet image failed to upload"})
    }
   
  }

  export {
    getAll,
    getOneById,
    create,
    updateById,
    deleteById, createImage
  }