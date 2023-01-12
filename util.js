const jwt = require('jsonwebtoken');
const config = require('./config');

const getToken = (user) => {
  return jwt.sign({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    perfil: user.perfil,

  }, config.JWT_SECRET, {
    expiresIn: '48h'
  })
}

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;
  //console.log('token',req.headers.authorization);
  if (token) {
    const onlyToken = token.slice(7, token.length);
    jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
      if (err) {
        //console.log('err , decode',err,decode);
        return res.status(401).send({ msg: 'Invalid Token' });
      }
      req.user = decode;
      next();
      return
    });
  } else {
    //console.log('token',token);
    return res.status(401).send({ msg: "Token is not supplied." });
  }
}

const isAdmin = (req, res, next) => {
  //console.log(req.user)
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(401).send({ msg: 'Admin Token is not valid.' })
}


//export {
//  getToken, isAuth, isAdmin
//}
module.exports = {
  getToken, isAuth, isAdmin
}