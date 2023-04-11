const mysql = require('mysql2');
const database = require('./connect');
// modulo de node para usar las promesas
const { promisify } = require('util');

const pool = mysql.createPool(database);

pool.getConnection(( error , connection ) => {
    if(error){
        if(error.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('La conexióna a la base de datos fue cerrada')
        }
        if(error.code === 'ER_CON_COUNT_ERROR'){
            console.error('La base de datos tienen demasiadas conexiones')
        }
        if(error.code === 'ECONNREFUSED'){
            console.error('La conexión a la base de datos fue rechazada')
        }
    }

    if(connection) connection.release();
    console.log('Base de datos conectada con éxito...');
    return;
});

// crear callbacks en promesas
pool.query = promisify(pool.query);

module.exports = pool;