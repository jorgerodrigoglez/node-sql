const { response } = require('express');
// encriptador de contraseña
const bcrypt = require('bcryptjs');
// database
const pool = require('../database/config');
// jwt
const jwt = require("jsonwebtoken");
// creacion de JWT
const { createJWT } = require('../helpers/jwt');

const newUser = async( req, res = response) => {

    try {
        
        const { name, email, password } = req.body;
        // encriptar contraseña
        const salt = await bcrypt.genSaltSync();
        const hashPassword = await bcrypt.hashSync(password, salt);

        // enviar datos a ddbb
        pool.query('INSERT INTO users SET ?', {name:name, email:email, password:hashPassword}, (error, results) => {
            if(error){
                console.error(error)
            }
            //res.redirect('/')
        });

        
        res.status(201).json({
            ok : true,
            msg: 'registro',
            //user: req.body,
            //name, email, password
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok : false,
            msg: 'Error de servidor, revise los datos del registro',
            //user: req.body,
            //name, email, password
        });
    }
}

const loginUser = async( req, res = response) => {
    
    try {

        const { email, password } = req.body;

        // verificar usuario en bbdd
        pool.query('SELECT * FROM users WHERE email = ?', [email], async( error, results ) => {

            //console.log(results);

            /*if(error){
                console.error(error);
            }*/

            if( results.length == 0 || ! ( await bcrypt.compareSync(password, results[0].password)) ) {

                res.status(400).json({
                    ok : false,
                    msg: 'El usuario no existe',
                })

            }else{
                const id = results[0].id;
                const name = results[0].name;
                // generar el token
                const token = await createJWT( id, name );
                /*const token = jwt.sign({id:id}, process.env.SECRET_JWT, {
                    expiresIn : process.env.EXPIRE_JWT
                });*/
                //console.log(`El token del usuario -- ${name} -- es -- ${token}`)

                res.json({
                    ok: true,
                    token
                })
            }
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok : false,
            msg: 'Error de servidor, revise los datos del login',
            //user: req.body,
            //name, email, password
        });
    }
}

const renewToken = async( req, res = response) => {

    //const uid = req.uid;
    //const name = req.name;

    const { uid, name } = req;

    // generar el token
    const token = await createJWT( uid, name );

    res.json({
        ok : true,
        msg: 'review',
        uid,name,
        token
    })
}

module.exports = {
    newUser,
    loginUser,
    renewToken
}