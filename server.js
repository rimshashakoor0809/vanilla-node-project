import { createServer } from 'http';
import path from 'path';
import { Router } from './core/Router.js';
import { bodyParser } from './utils/bodyParser.js';
// import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 2000;
const server = createServer();
const router = new Router();


router.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  res.end('Users' + id)
})
router.get('/api/:slug/test', (req, res) => res.end('Test Endpoint'))

server.on('request', (req, res, next) => {
  bodyParser(req, res, () => {
    logger(req, res, () => {
      router.handler(req, res, next);
    })
  })

})

server.listen(PORT, () => console.log(`Server is listening at port: ${PORT}`));

