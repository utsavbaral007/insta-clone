import React, { useState } from 'react'
import './newpost.css'
import { Button } from 'react-bootstrap'
import Axios from 'axios'
import loading from '../../logos/upload-animate.svg'

function Newpost(props) {
	const [title, setTitle] = useState('')
	const [image, setImage] = useState('')
	const [success, setSuccess] = useState('')
	const [error, setError] = useState('')
	const [uploading, setUploading] = useState(false)

	const postDetails = async () => {
		if (!image) {
			return setError('Please choose an image')
		}
		const data = new FormData()
		data.append('file', image)
		data.append('upload_preset', 'insta-clone')
		data.append('cloud_name', 'utsav007')
		try {
			setUploading(true)
			const response = await Axios.post(
				'https://api.cloudinary.com/v1_1/utsav007/image/upload',
				data
			)
			if (response.data.url) {
				try {
					const uploadResponse = await Axios.post(
						`${process.env.REACT_APP_URL}/newpost`,
						{
							title: title,
							image: response.data.url,
						},
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
							},
						}
					)
					if (uploadResponse.data.success) {
						setSuccess('Post Created Successfully')
						setUploading(false)
						setTimeout(() => {
							props.history.push('/')
						}, 1000)
					} else {
						setError('Failed to upload')
						setUploading(false)
					}
				} catch (error) {
					console.log(error.response)
					setUploading(false)
				}
			}
		} catch (err) {
			console.log(err.response)
			setUploading(false)
		}
	}
	return (
		<div className="new-post">
			<h3>Create a new Post</h3>
			<div className="form">
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Title"
				/>
				<input
					type="file"
					onChange={(e) => {
						setImage(e.target.files[0])
						setError('')
					}}
				/>
				{uploading ? (
					<Button className="uploading-btn">
						<img style={{ width: '30px' }} src={loading} alt="" />
					</Button>
				) : (
					<Button onClick={postDetails} className="upload-btn">
						Upload
					</Button>
				)}
				{error && error ? (
					<h6 className="err-msg">{error}</h6>
				) : (
					<h6 className="success-msg">{success}</h6>
				)}
			</div>
		</div>
	)
}
export default Newpost
