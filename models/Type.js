const { Schema, model } = require("mongoose");

const PokemonTypesSchema = Schema({
	id: Number,
    name: String,
    names: [
        {
            name: String,
            language: {
                name: String,
                url: String
            }
        }
    ],

});

module.exports = model("PokemonTypes", PokemonTypesSchema);
