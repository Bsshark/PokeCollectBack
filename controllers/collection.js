const Collection = require("../models/Collection");

const getCollectionById = async (req, res = response) => {
	try {
		const { id } = req.params;

		const resp = await Collection.findOne({ id }).exec();
		const newCollection = new Collection(resp);
		res.status(200).json(newCollection);
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Error con la colección",
		});
	}
};

const addItemCollection = async (req, res = response) => {
	try {
		const { body } = req;
		const { id } = body;

		const respFind = await Collection.findOne({ id }).exec();
		if (respFind) {
			let doc = await Collection.findOneAndUpdate({ id: id }, body);
			res.status(200).json({
				ok: true,
				msg: "Actualizado correctamente",
			});
            return;
		}

		let itemCollection = new Collection(body);
		await itemCollection.save();

		res.status(200).json({
			ok: true,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Error añadiendo a la colección",
		});
	}
};

module.exports = {
	getCollectionById,
	addItemCollection,
};
