const jwt = require('jsonwebtoken');
const segredo='segredo'

exports.verify = (req, res, next) => {  
        const token = req.headers.authorization.split(' ')[1];
          if (token == null) return res.sendStatus(401);
    jwt.verify(token, segredo, (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })

}