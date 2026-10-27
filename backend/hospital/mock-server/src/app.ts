import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiHandler, publicKeyApiHandler } from './handlers';
import middlewares from './middlewares';
import router from './router';

const app = express();
const apiUrl = process.env.MOCK_API_URL || '';

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.get(`${apiUrl}/`, (_req, res) => {
  res.json({ message: 'Modern Mock Service is running' });
});

app.use(router);
app.use(publicKeyApiHandler);
app.use(apiHandler);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
