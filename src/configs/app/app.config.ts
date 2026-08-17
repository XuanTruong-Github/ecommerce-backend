import { registerAs } from '@nestjs/config';

export const APP_CONFIG = 'app';
export default registerAs(APP_CONFIG, () => ({
  port: parseInt(process.env.PORT ?? '8080', 10),
}));
