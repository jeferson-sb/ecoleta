import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.get(
  '/points',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string()
        .regex(new RegExp(/\d,|\d/m))
        .required(),
    }),
  }),
  pointsController.index
);
routes.post(
  '/points',
  upload.single('image'),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string()
          .regex(new RegExp(/\d,|\d/m))
          .required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  pointsController.create
);
routes.get(
  '/points/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  pointsController.show
);
routes.put('/points/:id', pointsController.update);
routes.delete('/points/:id', pointsController.destroy);

export default routes;
