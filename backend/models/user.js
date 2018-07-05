const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true}, // unique does not validate the unique email , mongoose used it to optimise internally 
	password: { type: String, required: true}
});
// plugi is k/w provided by mongoose to validate against the third party plugin
userSchema.plugin(uniqueValidator);

// export is used because we want to access this outside the file as well
module.exports = mongoose.model('User', userSchema);