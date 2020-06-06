import dotenv from 'dotenv';
dotenv.config({ path: 'src/config/.env' });

let apiUrl;
if (process.env.NODE_ENV === 'production') {
  apiUrl = process.env.PRODUCTION_URL;
} else {
  apiUrl = `http://${process.env.LOCAL_IP}:3333`;
}

export default {
  port: process.env.PORT || 3333,
  host: process.env.HOST || 'localhost',
  mode: process.env.NODE_ENV,
  localIp: process.env.LOCAL_IP,
  apiUrl,
};
