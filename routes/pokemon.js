const { Router } = require("express");
const {
	retrievePokemonData,
	getPokemonById,
	getType,
	getPokemonByName,
    getPokemonWithPagination,
	getCollectionById,
	retrievePokemonSpeciesData,
	retrievePokemonTypes,
	deleteAll,
	getSpecies
} = require("../controllers/pokemon");

const router = Router();

router.get("/retrieve", retrievePokemonData);
router.get("/retrieveSpecies", retrievePokemonSpeciesData);
router.get("/retrieveTypes", retrievePokemonTypes);
router.get("/:id", getPokemonById);
router.get("/pagination/page", getPokemonWithPagination);
router.get("/name/:name", getPokemonByName);
router.get("/type/:id", getType);
router.get("/species/:id", getSpecies);
router.get("/deleteAll", deleteAll);

module.exports = router;
