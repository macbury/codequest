export default function userRequired(req, res, next) {
  //todo if json then just render failure json
  if (req.user == null) {
    res.redirect('/login')
  } else {
    next()
  }
}
