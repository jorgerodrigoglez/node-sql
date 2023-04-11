//const express = require('express');
//const router = express.Router;

const { Router } = require('express');
// express-validator
const { check } = require('express-validator');
// middleware - fiels-validator
const { fieldValidators } = require('../middlewares/field-validators');
// middleware - validate-jwt
const { validateJWT } = require('../middlewares/validate-jwt');
// controlers
const { newUser, loginUser, renewToken } = require('../controllers/auth');

const router = Router();


// auth - /api/auth/...

// rutas
// register
router.post( 
    '/new',
    [
        // middlewares validacion
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        check('password','La contraseña debe de tener 6 caracteres').isLength({ min: 6 }),
        fieldValidators,
    ], 
    newUser 
);
// login
router.post(
    '/',
    [
        check('email','El email no es válido').isEmail(),
        check('password','La contraseña debe de tener 6 caracteres').isLength({ min: 6 }),
        fieldValidators,
    ], 
    loginUser
);
// sesión - expira a las 2h
router.get('/renew', validateJWT, renewToken );

module.exports = router;