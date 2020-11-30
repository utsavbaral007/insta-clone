const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	fullName: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	profileImage: {
		type: String,
		default:
			'https://ih1.redbubble.net/image.1046392292.3346/st,small,845x845-pad,1000x1000,f8f8f8.jpg',
	},
	followers: [
		{
			type: ObjectId,
			ref: 'User',
		},
	],
	following: [
		{
			type: ObjectId,
			ref: 'User',
		},
	],
})
module.exports = mongoose.model('User', userSchema)
