const jwt = require("jsonwebtoken");

const createJWT = (uid, userName) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, userName };

    jwt.sign(
      payload,
      process.env.SECRET_JWT,
      {
        expiresIn: "2h"
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        }

        resolve(token);
      }
    );
  });
};

module.exports = {
  createJWT
};
