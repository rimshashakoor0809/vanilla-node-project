import { createServer } from 'http';
import path from 'path';
import { Router } from './core/router.js';
import { bodyParser } from './utils/bodyParser.js';
import { logger } from './utils/logger.js';
import { App } from './core/application.js';

const PORT = process.env.PORT || 2000;
const server = createServer();
const router = new Router();
const app = new App();

app.use(bodyParser);
app.use(logger);
app.use(logger);


router.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  res.end('Users' + id)
})
router.get('/api/:slug/test', (req, res) => res.end('Test Endpoint'));

app.use((err, req, res, next) => {
  console.log("Error in error middleware: ", err)
  if (err) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Error in Middleware', error: err?.message }))
  }
})
server.on('request', (req, res, next) => {

  // start middleware chain
  app.handler(req, res);

  // last middleware in middleware chain should call router.handler(req, res)
  app.use((req, res, next) => router.handler(req, res, next));

})

server.listen(PORT, () => console.log(`Server is listening at port: ${PORT}`));

