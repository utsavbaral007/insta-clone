import React, { useState, useEffect } from 'react'
import './profile.css'
import Axios from 'axios'

function Profile() {
	const activeUser = JSON.parse(localStorage.getItem('payload'))
	const [myPost, setMyPost] = useState([])
	useEffect(() => {
		const getMyPosts = async () => {
			try {
				const response = await Axios.get(
					`${process.env.REACT_APP_URL}/mypost`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
						},
					}
				)

				setMyPost(response.data.posts)
			} catch (err) {
				console.log(err)
			}
		}
		getMyPosts()
	}, [])

	const updatePhoto = async (file) => {
		if (!file) {
			return console.log('Please choose a file')
		}
		const data = new FormData()
		data.append('file', file)
		data.append('upload_preset', 'insta-clone')
		data.append('cloud_name', 'utsav007')
		try {
			const response = await Axios.post(
				'https://api.cloudinary.com/v1_1/utsav007/image/upload',
				data
			)
			if (response.data.url) {
				try {
					const updateResponse = await Axios.put(
						`${process.env.REACT_APP_URL}/updateprofilepic`,
						{ image: response.data.url },
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
							},
						}
					)
					if (updateResponse.data._id === activeUser._id) {
						localStorage.setItem('payload', JSON.stringify(updateResponse.data))
						setMyPost([...myPost])
					}
				} catch (err) {
					console.log(err.response)
				}
			} else {
				console.log('Error')
			}
		} catch (err) {
			console.log(err.response)
		}
	}

	return (
		<div className="profile-container">
			<div className="user-description">
				<div className="profile-image">
					<>
						<label for="change-photo">
							<h6 className="change-pic">change</h6>
						</label>
						<input
							type="file"
							id="change-photo"
							style={{ display: 'none' }}
							onChange={(e) => updatePhoto(e.target.files[0])}
						/>
					</>
					<img src={activeUser.profileImage} alt="" />
				</div>
				<div className="profile-description">
					<h4 style={{ padding: '0.5rem 0.5rem 0.5rem 0' }}>
						{activeUser.username}
					</h4>
					<div className="user-stats">
						{myPost.length === 1 ? (
							<h5>
								1 <span>Post</span>
							</h5>
						) : (
							<h5>
								{myPost.length} <span>Posts</span>
							</h5>
						)}

						{activeUser.followers.length / 2 === 0 ||
						activeUser.followers.length / 2 === 1 ? (
							<h5>
								{activeUser.followers.length / 2} <span>Follower</span>
							</h5>
						) : (
							<h5>
								{activeUser.followers.length / 2} <span>Followers</span>
							</h5>
						)}

						<h5>
							{activeUser.following.length} <span>Following</span>
						</h5>
					</div>
				</div>
			</div>
			<div className="gallery">
				{myPost.map((post) => (
					<img key={post._id} className="item" src={post.image} alt="" />
				))}
			</div>
		</div>
	)
}

export default Profile
