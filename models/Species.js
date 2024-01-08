const { Schema, model } = require("mongoose");

const PokemonSpeciesSchema = Schema({
	id: Number,
    name: String,
	capture_rate: Number,
	evolution_chain: {
		url: String,
	},
	evolves_from_species: {
		name: String,
		url: String,
	},
	flavor_text_entries: [
		{
			flavor_text: String,
			language: {
				name: String,
				url: String,
			},
			version: {
				name: String,
				url: String,
			},
		},
	],
    genera: [
        {
            genus: String,
            language: {
                name: String,
                url: String
            }
        }
    ],
    generation: {
        name: String,
        url: String
    },
    is_legendary: Boolean 
});

module.exports = model("PokemonSpecies", PokemonSpeciesSchema);
