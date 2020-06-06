import { Request, Response } from 'express';
import ItemsService from '../services/ItemsService';
import config from '../config';

class ItemsControler {
  async index(req: Request, res: Response) {
    const items = await ItemsService.selectAll();
    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `${config.apiUrl}/uploads/${item.image}`,
      };
    });

    return res.status(200).json({ serializedItems });
  }
}

export default ItemsControler;
