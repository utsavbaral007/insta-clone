const router = require('express').Router()
const Posts = require('../models/posts')
const verifyToken = require('./validtoken')

router.get('/allposts', verifyToken, async (req, res) => {
	const allPosts = await Posts.find()
		.populate('postedBy', '_id fullName username profileImage')
		.populate('comments.postedBy', '_id, username')
		.sort('-createdAt')
	try {
		res.send({ posts: allPosts })
	} catch (err) {
		res.status(400).send({ error: err })
	}
})

router.post('/newpost', verifyToken, async (req, res) => {
	console.log()
	req.user.password = undefined
	const newPost = new Posts({
		title: req.body.title,
		image: req.body.image,
		postedBy: req.user,
	})
	try {
		const post = await newPost.save()
		res.send({ success: true, post: post })
	} catch (err) {
		res.status(400).send({ error: err })
	}
})

router.get('/mypost', verifyToken, async (req, res) => {
	const myPost = await Posts.find({ postedBy: req.user._id }).populate(
		'postedBy',
		'_id fullname username'
	)
	try {
		res.send({ posts: myPost })
	} catch (err) {
		res.status(400).send({ error: err })
	}
})

router.put('/like', verifyToken, async (req, res) => {
	const addLike = await Posts.findByIdAndUpdate(
		req.body.postId,
		{
			$push: { likes: req.user._id },
		},
		{
			new: true,
		}
	)
	try {
		addLike.execPopulate((err, result) => {
			if (err) {
				return res.status(400).send(err)
			}
			res.send(result)
		})
	} catch (err) {
		return res.status(400).send(err)
	}
})

router.put('/unlike', verifyToken, async (req, res) => {
	const addLike = await Posts.findByIdAndUpdate(
		req.body.postId,
		{
			$pull: { likes: req.user._id },
		},
		{
			new: true,
		}
	)
	try {
		addLike.execPopulate((err, result) => {
			if (err) {
				return res.status(400).send(err)
			}
			res.send(result)
		})
	} catch (err) {
		return res.status(400).send(err)
	}
})

router.put('/comment', verifyToken, async (req, res) => {
	const comment = {
		text: req.body.comment,
		postedBy: req.user._id,
	}
	if (comment.text === '') {
		return res.status(400).send('Please write a comment')
	}
	const addComment = await Posts.findByIdAndUpdate(
		req.body.postId,
		{
			$push: { comments: comment },
		},
		{
			new: true,
		}
	)
	try {
		addComment
			.populate('comments.postedBy', '_id, username fullName')
			.execPopulate((err, result) => {
				if (err) {
					return res.status(400).send(err)
				}
				res.send(result)
			})
	} catch (err) {
		return res.status(400).send(err)
	}
})

router.delete('/deletepost/:postId', verifyToken, async (req, res) => {
	const deletePost = await Posts.findOne({ _id: req.params.postId }).populate(
		'postedBy',
		'_id, fullName, username'
	)
	try {
		await deletePost.execPopulate((err, post) => {
			if (err || !post) {
				return res.status(422).send(err)
			}
			if (post.postedBy._id.toString() === req.user._id.toString()) {
				post.remove((err, result) => {
					if (err) {
						return res.status(400).send(err)
					}
					res.send(result)
				})
			}
		})
	} catch (err) {
		res.status(400).send(err)
	}
})

router.delete('/deletecomment/:postId/:commentId', async (req, res) => {
	const comment = { _id: req.params.commentId }
	const deleteComment = await Posts.findByIdAndUpdate(
		req.params.postId,
		{
			$pull: { comments: comment },
		},
		{
			new: true,
		}
	)
		.populate('postedBy', '_id fullName username')
		.populate('comments.postedBy', '_id fullName username')
	try {
		deleteComment.execPopulate((err, result) => {
			if (err || !result) {
				return res.status(422).send(err)
			}
			res.send(result)
		})
	} catch (err) {
		res.status(400).send(err)
	}
})

router.get('/followingpost', verifyToken, async (req, res) => {
	const allPosts = await Posts.find({ postedBy: { $in: req.user.following } })
		.populate('postedBy', '_id fullName username profileImage')
		.populate('comments.postedBy', '_id, username')
		.sort('-createdAt')
	try {
		res.send({ posts: allPosts })
	} catch (err) {
		res.status(400).send({ error: err })
	}
})
module.exports = router
