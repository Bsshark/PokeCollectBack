const { respose } = require("express");
const Pokemon = require("../models/Pokemon");
const PokemonSpecies = require("../models/Species");
const PokemonTypes = require("../models/Type");
const axios = require("axios");

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
		const { limit, from } = headers;

		const resp = await Pokemon.find({ id: { $gt: from - 1 } })
			.sort({ id: "ascending" })
			.limit(limit)
			.exec();

		res.status(200).json(resp);
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Error al buscar con paginación",
		});
	}
};

const getPokemonByName = async (req, res = response) => {
	try {
		const { params } = req;

		const resp = await Pokemon.find({
			name: new RegExp(params.name, "i"),
		})
			.sort({ id: "ascending" })
			.exec();

		res.status(200).json(resp);
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Error buscando el pokemon",
		});
	}
};

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
	getPokemonWithPagination,
	deleteAll,
	retrievePokemonSpeciesData,
	retrievePokemonTypes,
};
