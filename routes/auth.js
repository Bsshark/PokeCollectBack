const { Router } = require("express");
const { check } = require("express-validator");
const {
	crearUsuario,
	loginUsuario,
	revalidarToken,
} = require("../controllers/auth");
const { validarJwt } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

/* GET home page. */
router.post(
	"/new",
	[
		check("name", "El nombre es obligatorio").not().isEmpty(),
		check("email", "El email es obligatorio").isEmail(),
		check("password", "La clave debe de ser de 6 caracteres").isLength({
			min: 8,
		}),
		validarCampos,
	],
	crearUsuario
);

router.post(
	"/",
	[
		check("email", "El email es obligatorio").not().isEmpty(),
		check("email", "El email no es válido").isEmail(),
		check("password", "La clave es obligatoria").not().isEmpty(),
		validarCampos,
	],
	loginUsuario
);

router.get("/renew", validarJwt, revalidarToken);

module.exports = router;
