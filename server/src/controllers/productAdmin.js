const db = require("../models");
const moment = require("moment");

const productController = {
	getAll: async (req, res) => {
		try {
			const product = await db.Product.findAll();
			return res.send(product);
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				message: error.message,
			});
		}
	},
	postProduct: async (req, res) => {
		try {
			const { name, description, price } = req.body;
			const newProduct = await db.Product.create({
				name,
				price,
				description,
			});
			res.send({
				message: "Produl berhasil ditambah",
				data: newProduct,
			});
		} catch (error) {
			res.status(500).send({
				message: error.message,
			});
		}
	},
	updateProduct: async (req, res) => {
		try {
			const { productId } = req.params;
			const { name, description, price } = req.body;
			const product = await db.Product.findOne({
				where: {
					id: productId,
				},
			});

			product.name = name;
			product.description = description;
			product.price = price;

			await product.save();
			return res.status(200).send({
				message: "Product berhasil diupdate",
				data: product,
			});
		} catch (error) {
			res.status(500).send({
				message: error.message,
			});
		}
	},
	deleteProduct: async (req, res) => {
		try {
			await db.Product.destroy({
				where: {
					id: req.params.id,
				},
			});
			return res.status(200).send({
				message: "Product berhasil dihapus",
			});
		} catch (error) {
			res.status(500).send({
				message: error.message,
			});
		}
	},
	getFilter: async (req, res) => {
		try {
			const filters = req.query;
			const filter = await db.Product.findAll({
				where: filters,
			});
			res.json(filter);
		} catch (error) {
			res.status(500).send({
				message: error.message,
			});
		}
	},
	getSorting: async (req, res) => {
		try {
			const { sortBy, sortOrder } = req.query;
			console.log(req.query);
			const sortedData = await db.Product.findAll({
				order: [[sortBy, sortOrder]],
			});
			res.json(sortedData);
		} catch (error) {
			console.log(error.message);
			res.status(500).send({
				message: error.message,
			});
		}
	},
	getPagnation: async (req, res) => {
		const { page, limit } = req.query;
		const offset = (page - 1) * limit;

		try {
			const posts = await db.Product.findAll({
				offset,
				limit: +limit,
			});
			res.json(posts);
		} catch (error) {
			console.error("Error retrieving users:", error);
			res.status(500).json({ message: "Internal server error" });
		}
	},
};

module.exports = productController;