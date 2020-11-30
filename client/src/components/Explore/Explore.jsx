import React, { useEffect, useState } from 'react'
import './explore.css'
import { FiHeart } from 'react-icons/fi'
import { GiBrokenHeart } from 'react-icons/gi'
import { AiOutlineDelete } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import Loading from '../../logos/loading-animate.svg'
import Axios from 'axios'

const activeUser = JSON.parse(localStorage.getItem('payload'))

function Explore() {
	const [posts, setPosts] = useState([])
	const [comment, setComment] = useState('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getPosts = async () => {
			try {
				const response = await Axios.get(
					`${process.env.REACT_APP_URL}/followingpost`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
						},
					}
				)
				setPosts(response.data.posts)
				setLoading(false)
			} catch (err) {
				console.log(err.response)
			}
		}
		getPosts()
	}, [])
	const likePost = async (id) => {
		try {
			const response = await Axios.put(
				`${process.env.REACT_APP_URL}/like`,
				{
					postId: id,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					},
				}
			)
			try {
				const newPosts = posts.map((post) => {
					if (post._id === response.data._id) {
						return { ...post, likes: response.data.likes }
					} else {
						return post
					}
				})
				setPosts(newPosts)
			} catch (err) {
				console.log(err)
			}
		} catch (err) {
			console.log(err)
		}
	}

	const unlikePost = async (id) => {
		try {
			const response = await Axios.put(
				`${process.env.REACT_APP_URL}/unlike`,
				{
					postId: id,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					},
				}
			)
			try {
				const newPosts = posts.map((post) => {
					if (post._id === response.data._id) {
						return { ...post, likes: response.data.likes }
					} else {
						return post
					}
				})
				setPosts(newPosts)
			} catch (err) {
				console.log(err)
			}
		} catch (err) {
			console.log(err)
		}
	}

	const makeComments = async (id) => {
		try {
			const response = await Axios.put(
				`${process.env.REACT_APP_URL}/comment`,
				{
					comment: comment,
					postId: id,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					},
				}
			)
			try {
				console.log(response)
				const newPosts = posts.map((post) => {
					if (post._id === response.data._id) {
						return { ...post, comments: response.data.comments }
					} else {
						return post
					}
				})
				setPosts(newPosts)
			} catch (err) {
				console.log(err)
			}
		} catch (err) {
			console.log(err.response.data)
		}
	}

	const deletePost = async (id) => {
		try {
			const response = await Axios.delete(
				`${process.env.REACT_APP_URL}/deletepost/${id}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					},
				}
			)
			const newPost = posts.filter((post) => {
				return post._id !== response.data._id
			})
			setPosts(newPost)
		} catch (err) {
			console.log(err)
		}
	}

	const deleteComment = async (postId, commentId) => {
		try {
			const response = await Axios.delete(
				`${process.env.REACT_APP_URL}/deletecomment/${postId}/${commentId}`
			)
			const newPost = posts.map((post) => {
				if (post._id === response.data._id) {
					return { ...post, comments: response.data.comments }
				}
				return post
			})
			setPosts(newPost)
		} catch (err) {
			console.log(err.response)
		}
	}
	if (loading) {
		return (
			<div style={{ textAlign: 'center' }}>
				<img src={Loading} alt="" />
			</div>
		)
	}
	return (
		<div className="home-container">
			{posts.map((post) => (
				<div key={post._id} className="post-container">
					<div className="post-heading">
						<img src={post.postedBy.profileImage} alt="" />
						<h5>
							{' '}
							<Link
								className="goto-profile"
								to={
									post.postedBy._id !== activeUser._id
										? `/profile/${post.postedBy._id}`
										: '/profile'
								}
							>
								{post.postedBy.username}
							</Link>
						</h5>
						{post.postedBy._id === activeUser._id && (
							<AiOutlineDelete
								className="delete-post"
								onClick={() => deletePost(post._id)}
							/>
						)}
					</div>
					<div className="post-image">
						<img src={post.image} alt="" />
					</div>
					<div className="post-footer">
						<div className="like-container">
							{post.likes.includes(activeUser._id) ? (
								<GiBrokenHeart
									className="unlike-btn"
									onClick={() => unlikePost(post._id)}
								/>
							) : (
								<FiHeart
									className="heart-icon"
									onClick={() => likePost(post._id)}
								/>
							)}
							{post.likes.length === 1 ? (
								<p>
									1 <span>like</span>
								</p>
							) : (
								<p>
									{post.likes.length} <span>likes</span>
								</p>
							)}
						</div>
						<h5 style={{ fontWeight: 'bold' }}>
							{post.postedBy.username}{' '}
							<span style={{ fontWeight: 'lighter' }}>{post.title}</span>
						</h5>
						{post.comments.map((comment) => (
							<h5 key={comment._id} style={{ fontWeight: 'bold' }}>
								{comment.postedBy.username}{' '}
								<span style={{ fontWeight: 'lighter' }}>{comment.text}</span>
								{comment.postedBy._id === activeUser._id && (
									<span>
										<AiOutlineDelete
											className="delete-comment"
											onClick={() => deleteComment(post._id, comment._id)}
										/>
									</span>
								)}
							</h5>
						))}
					</div>
					<div className="input-form">
						<form
							onSubmit={(e) => {
								e.preventDefault()
								makeComments(post._id)
							}}
						>
							{' '}
							<input
								type="text"
								placeholder="Add a comment..."
								value={comment}
								onChange={(e) => {
									setComment(e.target.value)
								}}
							/>
							<button
								type="submit"
								onClick={(e) => {
									e.preventDefault()
									makeComments(post._id)
								}}
							>
								Post
							</button>
						</form>
					</div>
				</div>
			))}
		</div>
	)
}

export default Explore
