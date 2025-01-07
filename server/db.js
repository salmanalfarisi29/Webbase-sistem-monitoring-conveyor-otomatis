const mongoose = require("mongoose");

module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		mongoose.connect(process.env.DB, connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}

	mongoose.connection.once('open', async () => {
		console.log("✅ Connected to database:", mongoose.connection.name);
	
		// Cek daftar koleksi dalam database
		const collections = await mongoose.connection.db.listCollections().toArray();
		console.log("📂 Koleksi dalam database:", collections.map(col => col.name));
	});
	
};
