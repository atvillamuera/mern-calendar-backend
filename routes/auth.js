/* Rutas de Usuarios / auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');


const router = Router();

router.post(
    '/new',
    [
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener al menos 6 caracteres, una mayúscula y un carácter especial (!, @, #, etc.)')
            .isLength({ min: 6 })
            .matches(/^(?=.*[A-Z])(?=.*[\W]).{6,}$/),
        validarCampos
    ],
    crearUsuario
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener al menos 6 caracteres, una mayúscula y un carácter especial (!, @, #, etc.)')
            .isLength({ min: 6 })
            .matches(/^(?=.*[A-Z])(?=.*[\W]).{6,}$/),
        validarCampos
    ],
    loginUsuario);

router.get(
    '/renew',
    validarJWT,
    revalidarToken);

module.exports = router;