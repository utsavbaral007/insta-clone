import React, { useState, useEffect } from 'react'
import './userprofile.css'
import Loading from '../../logos/loading-animate.svg'
import Axios from 'axios'

function Userprofile({ match }) {
	const [userProfile, setUserProfile] = useState({})
	const [allPost, setAllPost] = useState([])
	const [loading, setLoading] = useState(true)
	const activeUser = JSON.parse(localStorage.getItem('payload'))

	useEffect(() => {
		const getUser = async () => {
			try {
				const response = await Axios.get(
					`${process.env.REACT_APP_URL}/user/${match.params.userId}`,
					{
						headers: {
							AUthorization: `Bearer ${localStorage.getItem('accessToken')}`,
						},
					}
				)
				setUserProfile(response.data.User)
				setAllPost(response.data.allPost)
				setLoading(false)
			} catch (err) {
				console.log(err.response)
			}
		}
		getUser()
	}, [match.params.userId])

	const followUser = async () => {
		try {
			const response = await Axios.put(
				`${process.env.REACT_APP_URL}/follow`,
				{
					followId: match.params.userId,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					},
				}
			)
			localStorage.setItem('payload', JSON.stringify(response.data))
			setUserProfile({
				...userProfile,
				followers: response.data.following,
				following: response.data.followers,
			})
		} catch (err) {
			console.log(err)
		}
	}

	const unfollowUser = async () => {
		try {
			const response = await Axios.put(
				`${process.env.REACT_APP_URL}/unfollow`,
				{
					unfollowId: match.params.userId,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					},
				}
			)
			localStorage.setItem('payload', JSON.stringify(response.data))
			setUserProfile({
				...userProfile,
				followers: response.data.following,
				following: response.data.followers,
			})
		} catch (err) {
			console.log(err)
		}
	}
	if (loading) {
		return (
			<div style={{ textAlign: 'center' }}>
				<img src={Loading} alt=""></img>
			</div>
		)
	}
	return (
		<div className="profile-container">
			<div className="user-description">
				<div className="profile-image">
					<img src={userProfile.profileImage} alt="" />
				</div>
				<div className="profile-description">
					<h4 style={{ padding: '0.5rem 0.5rem 0.5rem 0' }}>
						{userProfile.username}
					</h4>
					<div className="user-stats">
						{allPost.length === 1 ? (
							<h5>
								1 <span>Post</span>
							</h5>
						) : (
							<h5>
								{allPost.length} <span>Posts</span>
							</h5>
						)}
						{userProfile.followers.length === 0 ||
						userProfile.followers.length === 1 ? (
							<h5>
								{userProfile.followers.length / 2} <span>Follower</span>
							</h5>
						) : (
							<h5>
								{userProfile.followers.length / 2} <span>Followers</span>
							</h5>
						)}

						<h5>
							{userProfile.following.length} <span>Following</span>
						</h5>
					</div>
					{!activeUser.following.includes(match.params.userId) ? (
						<button className="follow-btn" onClick={followUser}>
							Follow
						</button>
					) : (
						<button className="unfollow-btn" onClick={unfollowUser}>
							Unfollow
						</button>
					)}
				</div>
			</div>
			<div className="gallery">
				{allPost.map((post) => (
					<img key={post._id} className="item" src={post.image} alt="" />
				))}
			</div>
		</div>
	)
}

export default Userprofile
