const { Schema, model } = require("mongoose");

const CollectionSchema = Schema({
	id: Number,
    user_id: String,
	collection_items: [
		{
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
            isShiny: Boolean,
            date_caught: {type: Date, default: Date.now}
		},
	],
});

module.exports = model("Collection", CollectionSchema);
