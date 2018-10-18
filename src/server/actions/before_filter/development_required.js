export default function developmentRequired(req, res, next) {
  let isDevelopment = req.app.get('isDevelopment')
  if (isDevelopment) {
    next()
  } else {
    res.status(403)
    res.json({ message: 'Disabled in production' })
  }
}
