const {response} = require ('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario'); 
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {

    const {email, password} = req.body;

    try {
        let usuario = await Usuario.findOne({email: email});

        if(usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo',
            })
        }

        usuario = new Usuario(req.body);

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
        

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
    
        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador',
        })
    }

}

const loginUsuario = async(req, res = response) => {

    const {email, password} = req.body;

    try {
        const usuario = await Usuario.findOne({email: email});

        if(!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email',
            })
        }

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta',
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);
    
        return res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador',
        })
    }
}

const revalidarToken = async(req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token,
        uid: uid,
        name: name,
    })
}

module.exports = {crearUsuario, loginUsuario, revalidarToken};