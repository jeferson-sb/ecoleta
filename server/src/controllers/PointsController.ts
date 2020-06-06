import { Request, Response } from 'express';
import PointService from '../services/PointService';
import config from '../config';

class PointsControler {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;
    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await PointService.index(
      String(city),
      String(uf).toUpperCase(),
      parsedItems
    );

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `http://${config.localIp}:3333/uploads/${point.image}`,
      };
    });

    return res.json({
      success: true,
      length: points.length,
      data: serializedPoints,
    });
  }
  async create(req: Request, res: Response) {
    try {
      const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items,
      } = req.body;

      const { id, point } = await PointService.create({
        image: req.file.filename,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items,
      });

      return res.status(201).json({ success: true, data: { id, ...point } });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: `Unable to create new point, please try again.`,
      });
    }
  }

  async show(req: Request, res: Response) {
    const id = req.params.id;

    const { point, items } = await PointService.show(Number(id));

    if (!point) {
      return res.status(400).json({ success: false, error: 'Point not found' });
    }

    const serializedPoint = {
      ...point,
      image_url: `${config.apiUrl}/uploads/${point.image}`,
    };

    return res.json({ sucess: true, data: { serializedPoint, items } });
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updatedData: {
        name?: string;
        email?: string;
        whatsapp?: string;
        latitude?: number;
        longitude: number;
        city?: string;
        uf?: string;
        items?: number[];
      } = req.body;

      const updatedPoint = await PointService.update(Number(id), updatedData);
      return res.status(200).json({ success: true, data: updatedPoint });
    } catch (error) {
      return res.status(400).json({ success: false, error: 'Point not found' });
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await PointService.destroy(Number(id));
      return res.status(204).json({ success: true });
    } catch (error) {
      return res.status(400).json({ success: false, error: 'Point not found' });
    }
  }
}

export default PointsControler;
