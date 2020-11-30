const joi = require('joi')

const registerValidation = (data) => {
	const userSchema = joi.object({
		email: joi.string().required().email(),
		fullName: joi.string().required().min(5),
		username: joi.string().required().min(5),
		password: joi.string().required().min(8),
		profileImage: joi.string(),
	})
	return userSchema.validate(data)
}
module.exports.registerValidation = registerValidation

const loginValidation = (data) => {
	const userSchema = joi.object({
		username: joi.string().required().min(5),
		password: joi.string().required().min(8),
	})
	return userSchema.validate(data)
}
module.exports.loginValidation = loginValidation
