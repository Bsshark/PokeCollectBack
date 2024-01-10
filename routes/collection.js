const { Router } = require("express");
const {
	getCollectionById,
    addItemCollection
} = require("../controllers/collection");
const { validarJwt } = require("../middlewares/validar-jwt");

const router = Router();

router.post("/add", validarJwt, addItemCollection);
router.get("/find/:id", getCollectionById);


module.exports = router;
