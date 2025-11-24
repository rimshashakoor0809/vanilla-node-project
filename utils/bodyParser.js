import BusBoy from 'busboy';
export const bodyParser = (req, res, next) => {
  const contentType = (req.headers['content-type'] || '').toLowerCase()
  const mime = contentType.split(';')[0].trim()
  const textContentType = [
    'application/json',
    'application/x-www-form-urlencoded',
    'text/plain',
    'application/xml',
    'text/xml',
  ]
  const isBinary = !textContentType.includes(mime) || !mime;
  console.log("content: ", contentType)

  if (mime === 'multipart/form-data') {
    const busboy = new BusBoy({ headers: req.headers });
    const fields = {};
    const files = [];

    busboy.on('field', (filename, value) => {
      fields[filename] = value
    })

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const chunks = [];

      file.on('data', chunk => chunks.push(chunk));
      file.on('end', () => {
        files.push({
          fieldname, filename, encoding, mimetype, buffer: Buffer.concat(chunks)
        })
      })
    })

    busboy.on('finish', () => {
      req.body = fields;
      req.files = files;
      next();
    })

    busboy.on('error', (err) => {
      console.log("Busboy error: ", err)
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Error parsing multipart body', error: err?.message }))
    });
    req.pipe(busboy);
    return
  }


  const chunks = [];
  let body = null;

  req.on('data', (chunk) => {
    chunks.push(chunk);
  })

  req.on('end', () => {
    let raw = Buffer.concat(chunks)
    try {
      switch (mime) {
        case 'application/json':
          body = raw.toString();
          body = JSON.parse(body);
          break;
        case 'application/x-www-form-urlencoded':
          body = raw.toString();
          const decodedURL = decodeURIComponent(body)?.split('&');
          const formattedArr = decodedURL?.map(item => item?.split('='));
          body = {}
          for (const [key, value] of formattedArr) {
            body[key] = value;
          }
          break;
        case 'text/plain':
          body = raw.toString();
          break;
      }
      req.body = isBinary ? raw : body
      next();
    } catch (error) {
      console.log("Error: ", error)
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Error parsing body stream', error: error?.message }))

    }
  })
}