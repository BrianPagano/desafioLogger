function publicAcces (req, res, next){
 if (req.session.user) return res.redirect('/profile')
 next ()
}

module.exports = publicAcces