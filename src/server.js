import './config/database.js';
import path from 'path';
import { createServer } from 'http';
import { App } from './core/application.js';
import { bodyParser } from './middlewares/bodyParser.js';
import { logger } from './middlewares/logger.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import { AppError } from './utils/error.js';
import { catchAsync } from './utils/catchAsync.js';
import { login, register } from './controllers/auth.controller.js';
import { Router } from './core/router.js';
import { cookieHelper, cookieParser } from './middlewares/cookies.js';

const PORT = process.env.PORT || 2000;
const server = createServer();
const router = new Router();
const app = new App();

// Routes
router.post('/api/auth/register', register);
router.post('/api/auth/login', login);

app.use(cookieHelper);
app.use(cookieParser);
app.use(bodyParser);
app.use(logger);
app.use((req, res, next) => router.handler(req, res, next));
app.use(globalErrorHandler)

server.on('request', (req, res, next) => {
  // start middleware chain
  app.handler(req, res);
})
server.listen(PORT, () => console.log(`Server is listening at port: ${PORT}`));

