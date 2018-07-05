const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
	title: { type: String, required: true},
	content: { type: String, required: true},
	// mongoDb store the id as a string , but mongoose store it as different object, we are just extracting it
	creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

// export is used because we want to access this outside the file as well
module.exports = mongoose.model('Post', postSchema);