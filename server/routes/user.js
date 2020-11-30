const router = require('express').Router()
const Posts = require('../models/posts')
const verifyToken = require('./validtoken')
const Users = require('../models/user')

router.get('/user/:id', verifyToken, async (req, res) => {
	try {
		const User = await Users.findOne({ _id: req.params.id }).select('-password')
		await Posts.find({ postedBy: req.params.id })
			.populate('postedBy', '_id fullName username')
			.exec((err, allPost) => {
				if (err) {
					return res.status(400).send(err)
				}
				res.send({ User, allPost })
			})
	} catch (err) {
		return res.status(404).send({ error: 'User not found' })
	}
})

router.put('/follow', verifyToken, async (req, res) => {
	await Users.findByIdAndUpdate(
		req.body.followId,
		{
			$push: { followers: req.user._id },
		},
		{ new: true },
		async (err) => {
			if (err) {
				return res.status(422).send(err)
			}
			await Users.findByIdAndUpdate(
				req.user._id,
				{
					$push: { following: req.body.followId },
				},
				{
					new: true,
				}
			)
				.select('-password')
				.exec((err, result) => {
					if (err) {
						res.status(422).send(err)
					}
					res.send(result)
				})
		}
	)
})

router.put('/unfollow', verifyToken, async (req, res) => {
	await Users.findByIdAndUpdate(
		req.body.unfollowId,
		{
			$pull: { followers: req.user._id },
		},
		{ new: true }
	).exec(async (err) => {
		if (err) {
			res.send(422).send(err)
		}
		await Users.findByIdAndUpdate(
			req.user._id,
			{
				$pull: { following: req.body.unfollowId },
			},
			{
				new: true,
			}
		)
			.select('-password')
			.exec((err, result) => {
				if (err) {
					res.status(400).send(err)
				}
				res.send(result)
			})
	})
})

router.put('/updateprofilepic', verifyToken, async (req, res) => {
	await Users.findByIdAndUpdate(
		req.user._id,
		{
			$set: { profileImage: req.body.image },
		},
		{ new: true }
	)
		.select('-password')
		.exec((err, result) => {
			if (err) {
				return res.status(422).send('Profile picture cannot be updated')
			}
			res.send(result)
		})
})

router.post('/search', verifyToken, async (req, res) => {
	const userPattern = new RegExp('^' + req.body.searchUser)
	await Users.find({ username: { $regex: userPattern } })
		.select('-password')
		.exec((err, result) => {
			if (err) {
				res.status(422).send(err)
			}
			res.send(result)
		})
})

module.exports = router
