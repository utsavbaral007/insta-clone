const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = (req, res, next) => {
	const { authorization } = req.headers
	if (!authorization) {
		return res.status(401).send({ error: 'You must be logged in to continue' })
	}
	const token = authorization.replace('Bearer ', '')
	jwt.verify(token, process.env.SECRET_TOKEN, async (err, payload) => {
		if (err) {
			return res
				.status(401)
				.send({ error: 'You must be logged in to continue' })
		}
		const { _id } = payload
		const findUser = await User.findById(_id)
		req.user = findUser
		next()
	})
}
