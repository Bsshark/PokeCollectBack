const { respose } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let usuario = await User.findOne({ email });
		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: "El correo introducido ya existe.",
			});
		}

		usuario = new User(req.body);

		//Encriptar clave
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();
		//Generar JWT
		const token = await generateJWT(usuario.id, usuario.name);

		res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: `Error. Por favor contacte con el administrador.`,
		});
	}
};

const loginUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const usuario = await User.findOne({ email });
		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: "El usuario o el correo no son correctos.",
			});
		}

		//Claves
		const validPassword = bcrypt.compareSync(password, usuario.password);
		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: "Clave no válida.",
			});
		}

		//Generar JWT
		const token = await generateJWT(usuario.id, usuario.name);

		return res.status(200).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			photoUrl: usuario.photoUrl,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: `Error. Por favor contacte con el administrador.`,
		});
	}
};

const revalidarToken = async (req, res = respose) => {
	const { uid, name } = req;

	//Generate nuevo JWT
	const token = await generateJWT(uid, name);

	res.json({
		ok: true,
		uid,
		name,
		token
	});
};

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidarToken,
};
