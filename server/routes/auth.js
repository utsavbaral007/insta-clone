const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../models/validation')

router.post('/register', async (req, res) => {
	//validation
	const { error } = registerValidation(req.body)
	if (error) {
		return res.status(422).send({ error: error.details[0].message })
	}

	//existing user my email
	const existingUser = await User.findOne({ email: req.body.email })
	if (existingUser) {
		return res.status(422).send({ error: 'Email already exists' })
	}

	const existingUserUsername = await User.findOne({
		username: req.body.username,
	})
	if (existingUserUsername) {
		return res.status(422).send({
			error: 'Username already taken. Please choose a different username',
		})
	}

	//hash password
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(req.body.password, salt)

	const newUser = new User({
		email: req.body.email,
		fullName: req.body.fullName,
		username: req.body.username,
		password: hashedPassword,
		profileImage: req.body.profileImage,
	})
	try {
		const user = await newUser.save()
		res.send({ success: true, payload: user })
	} catch (err) {
		return res.status(400).send(err)
	}
})

router.post('/login', async (req, res) => {
	//validation
	const { error } = loginValidation(req.body)
	if (error) {
		return res.status(422).send({ error: error.details[0].message })
	}

	//emailcheck
	const validEmail = await User.findOne({ username: req.body.username })
	if (!validEmail) {
		return res.status(422).send({ error: 'Invalid username or password' })
	}

	//passwordMismatch
	const checkPassword = await bcrypt.compare(
		req.body.password,
		validEmail.password
	)
	if (!checkPassword) {
		return res.status(422).send({ error: 'Invalid username or password' })
	}
	const token = jwt.sign({ _id: validEmail._id }, process.env.SECRET_TOKEN)
	const {
		_id,
		fullName,
		username,
		email,
		followers,
		following,
		profileImage,
	} = validEmail
	res.send({
		success: true,
		accessToken: token,
		user: {
			_id,
			fullName,
			username,
			email,
			followers,
			following,
			profileImage,
		},
	})
})

module.exports = router
