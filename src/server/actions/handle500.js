export default function handle500(err, req, res) {
  let isDevelopment = req.app.get('isDevelopment')
  res.status(err.status || 500)
  if (isDevelopment) {
    let message = err.message
    res.json({ message, err })
  } else {
    res.json({ message: 'Internal server error' })
  }
}
