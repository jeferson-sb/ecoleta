import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('File must be an image'));
    }
    cb(undefined, true);
  },
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(request, file, callback) {
      const hash = crypto.randomBytes(6).toString('hex');
      const fileName = `${hash}-${file.originalname}`;
      callback(null, fileName);
    },
  }),
};
