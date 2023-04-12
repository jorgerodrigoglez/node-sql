const express = require('express');
require('dotenv').config();
const cors = require('cors');

// servidor
const app = express();

// CORS
app.use(cors());

// directorio publico - middleware
app.use( express.static('public'));

// lectura del body - extraer contenido de archivos json
app.use( express.json() );

// rutas - middleware
app.use('/api/auth', require('./routes/auth'));
// rutas - middleware
app.use('/api/events', require('./routes/events'));

// escucha de peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto: ${process.env.PORT}`)
});