const { respose } = require("express");
const Pokemon = require("../models/Pokemon");
const PokemonSpecies = require("../models/Species");
const PokemonTypes = require("../models/Type");
const axios = require("axios");
const { head } = require("../routes/pokemon");
const { header } = require("express-validator");

const url = "https://pokeapi.co/api/v2/pokemon/";
const urlSpecies = "https://pokeapi.co/api/v2/pokemon-species/";
const urlTypes = "https://pokeapi.co/api/v2/type/";
const nPokemons = 1025; //1025
const nTypes = 18; //18

const retrievePokemonData = async (req, res = response) => {
	const promises = [];
	Pokemon.deleteMany({}).exec();
	try {
		for (let i = 1; i <= nPokemons; i++) {
			promises.push(await axios.get(`${url}/${i}`));
		}

		Promise.all(promises).then((results) => {
			results.forEach(async (result) => {
				result.data.name =
					result.data.name.charAt(0).toUpperCase() + result.data.name.slice(1);
				const newPokemon = new Pokemon(result.data);
				newPokemon.types = [];
				result.data.types.forEach((type) => {
					newPokemon.types.push(type.type);
				});
				await newPokemon.save(); //Descomentar para recibir toda la info
			});
			res.status(200).json({
				ok: true,
			});
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: `Error, por favor contacte con el administrador.`,
		});
	}
};

const retrievePokemonSpeciesData = async (req, res = response) => {
	const promises = [];
	try {
		for (let i = 1; i <= nPokemons; i++) {
			promises.push(await axios.get(`${urlSpecies}/${i}`));
		}

		Promise.all(promises).then((results) => {
			results.forEach(async (result) => {
				result.data.name =
					result.data.name.charAt(0).toUpperCase() + result.data.name.slice(1);
				const newPokemonSpecies = new PokemonSpecies(result.data);
				await newPokemonSpecies.save();
			});
			res.status(200).json({
				ok: true,
			});
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: `Error, por favor contacte con el administrador.`,
		});
		console.log(error);
	}
};

const retrievePokemonTypes = async (req, res = response) => {
	const promises = [];

	try {
		PokemonTypes.deleteMany({ name: { $exists: true } }).exec();
		for (let i = 1; i <= nTypes; i++) {
			promises.push(await axios.get(`${urlTypes}/${i}`));
		}

		Promise.all(promises).then((results) => {
			results.forEach(async (result) => {
				const newPokemonType = new PokemonTypes(result.data);
				await newPokemonType.save();
			});
			res.status(200).json({
				ok: true,
			});
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: `Error, contacte cone el administrador`,
		});
	}
};

const getPokemonById = async (req, res = response) => {
	try {
		const { params } = req;

		const resp = await Pokemon.findOne({ id: params.id });
		const newPokemon = new Pokemon(resp);
		res.status(200).json(newPokemon);
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Error contacte con el administrador",
		});
	}
};

const getPokemonWithPagination = async (req, res = response) => {
	try {
		const { headers } = req;
		const { limit, from, typefilter } = headers;

		getTypeInEnglish(typefilter).then(async (result) => {
			var filter = {};
			if (typefilter) filter = { ...filter, "types.name": result.name };
			const resp = await Pokemon.find(filter)
				.sort({ id: "ascending" })
				.skip(from)
				.limit(limit)
				.exec();

			res.status(200).json(resp);
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Error al buscar con paginación",
		});
	}
};

const getPokemonByName = async (req, res = response) => {
	try {
		const { params, headers } = req;
		const { typefilter } = headers;

		getTypeInEnglish(typefilter).then(async (result) => {
			var filter = {};
			if (typefilter) filter = { ...filter, "types.name": result.name };
			if (params.name)
				filter = { ...filter, name: new RegExp(params.name, "i") };

			console.log(filter);
			const resp = await Pokemon.find(filter).sort({ id: "ascending" }).exec();

			res.status(200).json(resp);
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Error buscando el pokemon",
		});
	}
};

const test = (value) => {
	return value * 2;
}

const getType = async (req, res = response) => {
	try {
		const { params } = req;

		const resp = await PokemonTypes.findOne({ id: params.id }).exec();
		const newPokemonType = new PokemonTypes(resp);
		res.status(200).json(newPokemonType);
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Error con los tipos",
		});
	}
};

const getSpecies = async (req, res = response) => {
	try {
		const { id } = req.params;

		const resp = await PokemonSpecies.findOne({ id }).exec();
		const newPokemonSpecies = new PokemonSpecies(resp);
		res.status(200).json(newPokemonSpecies);
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Error con las especies",
		});
	}
};

const getTypeInEnglish = async (name) => {
	try {
		const resp = await PokemonTypes.findOne({
			"names.name": name ? titleCase(name) : {},
		}).exec();
		return resp;
	} catch (error) {
		console.log(error);
	}
};

const titleCase = (str) => {
	return str
		.toLowerCase()
		.split(" ")
		.map(function (word) {
			return word.replace(word[0], word[0].toUpperCase());
		})
		.join(" ");
};

const getTypeInLanguage = async (lang, name) => {
	try {
		const resp = await PokemonTypes.findOne({ name }).exec();
		const allNames = resp.names;
		console.log(allNames.find((name) => name.language.name == "es"));
		return allNames.find((name) => name.language.name == lang);
	} catch (error) {
		console.log(error);
	}
};

const deleteAll = async (req, res = response) => {
	try {
		Pokemon.deleteAll();
		res.status(200).json({
			ok: true,
			msg: "Base de datos eliminada",
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Error contacte con el administrador",
		});
	}
};
module.exports = {
	retrievePokemonData,
	getPokemonById,
	getPokemonByName,
	getType,
	getSpecies,
	getPokemonWithPagination,
	deleteAll,
	retrievePokemonSpeciesData,
	retrievePokemonTypes,
};
