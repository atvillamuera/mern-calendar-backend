/* Rutas de Events 
    /api/aueventsth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const {validarCampos} = require('../middlewares/validar-campos');


const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');

const router = Router();

//Esto obliga a que todas las peticiones posteriores use validarJWT
router.use(validarJWT);

//Obtener eventos
router.get('/', getEventos)

//Crear eventos
router.post('/',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        validarCampos,
    ],
     crearEvento)

//actualizar eventos
router.put(
    '/:id', 
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEvento 
);

//eliminar eventos
router.delete('/:id', eliminarEvento)

module.exports = router