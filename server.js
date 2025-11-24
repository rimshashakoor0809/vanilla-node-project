import { createServer } from 'http';
import path from 'path';

const PORT = process.env.PORT || 2000;
const server = createServer();


server.listen(PORT, () => console.log(`Server is listening at port: ${PORT}`));

