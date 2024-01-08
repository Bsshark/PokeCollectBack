const { Schema, model } = require("mongoose");

const PokemonSchema = Schema({
	game_indices: [
		{
			game_index: Number,
			version: {
				name: String,
				url: String,
			},
		},
	],
	id: Number,
	name: String,
	sprites: {
		back_default: String,
		back_shiny: String,
		front_default: String,
		front_shiny: String,
	},
	types: [
		{
            name: String,
            url: String
        }
	],
	weight: Number,
});

module.exports = model("Pokemon", PokemonSchema);
