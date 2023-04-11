const { response } = require('express');
// express validator
const { validationResult } = require('express-validator');

const fieldValidators = ( req, res = response, next ) => {

   // manejo de errores
   const errors = validationResult( req );
   //console.log(errors);
   // si hay errores
   if(!errors.isEmpty()){
       return res.status(400).json({
           ok: false,
           errors: errors.mapped(),
       })
   }

    next();
}

module.exports = {
    fieldValidators
}