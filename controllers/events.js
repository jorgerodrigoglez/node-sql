const { response } = require('express');
// database
const pool = require('../database/config');

// listar todos los eventos
const getEvents = ( req, res = response ) => {

    try {
        // traer eventos de la DDBB
        pool.query('SELECT * FROM events' , ( error, results ) => {
            //console.log(results);
            if(error){
                console.error(error);
            }

            if( results.length > 0  ) {
                res.status(200).json({
                    ok : true,
                    msg: 'getEvents',
                    results
                })

            }else{
                res.status(200).json({
                    ok : true,
                    msg: 'No hay resultados para eventos',
                })
            }
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok : false,
            msg: 'Error de servidor al seleccionar los eventos',
        });
    }
}

// crear un evento
const createEvent = ( req, res = response ) => {

    const { title, notes, start, end } = req.body;
    //console.log(req.body);
    const { uid } = req;
    //console.log({uid});

    try {
    
        // enviar datos a ddbb
        pool.query('INSERT INTO events SET ?', { title:title, notes:notes, start:start, end:end, user_id:uid }, (error, results) => {

            if(error){
                console.error(error)
            }
        });

        res.json({
            ok: true,
            msg: 'Evento guardado'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo crear el evento, error de servidor'
        });
    }

}

// editar un evento
const editEvent = ( req, res = response ) => {

    // parametro id de la url
    const eventId = req.params.id;
    //console.log(eventId);

    // uid del usuario
    const { uid } = req;
    //console.log({uid});

    // datos a actualizar
    const { title, notes, start, end } = req.body;
    //console.log(id,title,notes,start,end);

    // update event
    const newEvent = {
        title,
        notes,
        start,
        end
    }

    try {
        // editar el evento
        pool.query('UPDATE events SET ? WHERE id = ? AND user_id = ?', [newEvent, eventId, uid], ( error, results ) => {

            //console.log(results);

            /*if(error){
                console.error(error);
            }*/

            res.status(200).json({
                ok: true,
                msg: 'El evento ha sido actualizado'
            });
            
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo editar el evento, error de servidor'
        });
    }

}

const deleteEvent = ( req, res = response ) => {
    // parametro id de la url
    const id = req.params.id;

    //console.log(eventId);

    try {
        // editar el evento
        pool.query('DELETE FROM events WHERE id = ?', [id], ( error, results ) => {

            //console.log(results);
            
            /*if(error){
                console.error(error);
            }*/

            res.status(200).json({
                ok: true,
                msg: 'El evento ha sido borrado'
            });
               
        });
        
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
