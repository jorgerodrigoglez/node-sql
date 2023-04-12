// auth - /api/events/...

const { Router } = require('express');
const router = Router();
// middleware - validate-jwt
const { validateJWT } = require('../middlewares/validate-jwt');
// express-validator
const { check } = require('express-validator');
// middleware - fiels-validator
const { fieldValidators } = require('../middlewares/field-validators');
// helper - fieldValidators .custom() - validar fechas
const { isDate } = require('../helpers/isDate');

const { getEvents, createEvent, editEvent, deleteEvent } = require('../controllers/events');

// validar token - todas las rutas tienen que validar el token
router.use( validateJWT );

// obtener eventos
router.get('/', getEvents);

// crear nuevo evento
router.post(
    '/',
    [
          // middlewares validacion
          check('title','El título es obligatorio').not().isEmpty(),
          check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
          check('end', 'La fecha de finalización es obligatoria').custom( isDate ),
          fieldValidators
    ],
    createEvent
);

// editar evento
router.put('/:id', editEvent);

// borrar evento
router.delete('/:id', deleteEvent);

module.exports = router;
