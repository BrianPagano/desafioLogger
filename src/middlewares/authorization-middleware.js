const authorization = role => {
    return (req,res,next) => {
        if (!req.user)
            return res.status(401).json ({status:'error', error: 'Unauthorized'})

        if(req.user.role != role)
            return res.status(401).json ({status:'error', error: 'forbiden'})
        next()
    }
}

module.exports = authorization