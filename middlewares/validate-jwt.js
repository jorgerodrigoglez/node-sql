const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = (req, res = response, next) => {
  // x-token headers
  const token = req.header("x-token");
  //console.log(token);

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición"
    });
  }

  try {
    const { uid, userName } = jwt.verify(token, process.env.SECRET_JWT);
    //console.log(payload);
    req.uid = uid;
    req.name = userName;

  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido"
    });
  }

  next();
};

module.exports = {
  validateJWT
};
