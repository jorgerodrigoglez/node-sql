const { response } = require('express');
const moment = require('moment');
// database
const pool = require('../database/config');

// listar todos los eventos
const getEvents = async( req, res = response ) => {

    // id de usuario
    const { uid } = req;
    //console.log(uid);

    try {

        //trae todos los eventos añadiendo el name de la tabla users
        const getResults = await pool.query('SELECT * FROM users LEFT JOIN events ON user_id = users.id ');
        //console.log(getResults);
        //await pool.query('SELECT * FROM events', ( error, results ) => {
            //console.log(results);

            /*if(error){
                console.error(error);
            }*/


        if( getResults.length > 0 ) {
            res.status(200).json({
                ok : true,
                msg: 'getEvents',
                events : getResults
            });
            //console.log(getResults);

        }else{
            res.status(200).json({
                ok : true,
                msg: 'No hay resultados para eventos',
            })
        }
    

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok : false,
            msg: 'Error de servidor al seleccionar los eventos',
        });
    }
}

// crear un evento
const createEvent = async( req, res = response ) => {
    
    try {
        const { title, notes, start, end } = req.body;
        //console.log(req.body);
        // id de usuario
        const { uid } = req;
        //console.log({uid});
        // momment - formato de fechas 
        const startSQLFormat = moment(start).format('YYYY-MM-DD HH:mm:ss');
        const endSQLFormat = moment(end).format('YYYY-MM-DD HH:mm:ss');

        // enviar datos a ddbb
        await pool.query('INSERT INTO events SET ?', { title:title, notes:notes, start: startSQLFormat, end:endSQLFormat, user_id:uid }, async(error, results) => {

            if(error){
                console.error(error)
            }
            // selecciona el id del registro insertado - este id se necesita para el frontend
            let idEvent = await pool.query('SELECT @@IDENTITY AS id');
            idEvent = idEvent[0].id;
            ///console.log(idEvent);
            // seleccionar el nombre del usuario
            const nameUserById = await pool.query('SELECT name FROM users WHERE id = ?', [uid]);
            const nameUser = await nameUserById[0].name;
            //console.log(nameUser);
            // creamos el evento para enviarlo al fronted
            const event = {
                id: idEvent,
                title,
                notes,
                start,
                end,
                user_id: uid,
                // extraido de BBDD
                name: nameUser
            }
            
            res.json({
                ok: true,
                msg: 'Evento guardado',
                event
            });
          
        });


        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo crear el evento, error de servidor'
        });
    }

}

// editar un evento
const editEvent = async( req, res = response ) => {

    // parametro id de la url
    const eventId = req.params.id;
    //console.log(eventId);

    // uid del usuario registrado
    const { uid } = req;
    //console.log(uid);

    try {
        const selectIdEdit = await pool.query('SELECT user_id FROM events WHERE id = ?', [eventId]);
        //console.log(selectIdEdit);
        const selectUserId = selectIdEdit[0];
        //console.log(selectUserId);

        if(selectUserId.user_id !== uid){
            return res.status(401).json({
                ok: false,
                msg: "No tiene el privilegio de editar este evento"
            });

        }else{
             // datos a actualizar
            const { title, notes, start, end } = req.body;
            //console.log(title,notes,start,end);

            // momment - formato de fechas 
            const startSQLFormat = moment(start).format('YYYY-MM-DD HH:mm:ss');
            const endSQLFormat = moment(end).format('YYYY-MM-DD HH:mm:ss');

            // update event
            const newEvent = {
                title,
                notes,
                start: startSQLFormat,
                end: endSQLFormat,
            }
            //console.log(newEvent);
            // editar el evento
            await pool.query('UPDATE events SET ? WHERE id = ? ', [newEvent, eventId ], ( error, results ) => {
    
                //console.log(results);
    
                if(error){
                    console.error(error);
                }
            
                res.status(200).json({
                    ok: true,
                    msg: 'El evento ha sido actualizado',
                    //name : nameUser
                });
                
            });

        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo editar el evento, error de servidor'
        });
    }

}

const deleteEvent = async( req, res = response ) => {
    // parametro id de la url
    const id = req.params.id;
    // uid del usuario registrado
    const { uid } = req;

    try {
        const selectIdEdit = await pool.query('SELECT user_id FROM events WHERE id = ?', [id]);
        //console.log(selectIdEdit);
        const selectUserId = selectIdEdit[0];
        //console.log(selectUserId);

        if(selectUserId.user_id === uid){

            await pool.query('DELETE FROM events WHERE id = ?', [id], ( error, results ) => {

                //console.log(results);
                
                /*if(error){
                    console.error(error);
                }*/

                res.status(200).json({
                    ok: true,
                    msg: "El evento ha sido borrado"
                });

             });

        }else{

            res.status(401).json({
                ok: false,
                msg: "No tiene el privilegio de borrar este evento"
            });
               
        };
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo borrar el evento, error de servidor'
        });
    }

}

module.exports = {
    getEvents,
    createEvent,
    editEvent,
    deleteEvent
}
