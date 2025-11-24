export const logger = (req, res, next) => {
  const { method, url } = req || {}
  const timestamp = Date.now();
  const dateObject = new Date(timestamp);

  const formattedDateTime = dateObject.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  });
  console.log('\x1b[34m%s\x1b[0m', `[${formattedDateTime}] ${method.toUpperCase()}: ${url}`)
  console.log('================================')
  console.log('\x1b[38;5;208m%s\x1b[0m', 'Request Body:', req.body) /
    next();
}