import React, { useState } from 'react'
import './signup.css'
import instaWord from '../../logos/insta-logo.png'
import { Link } from 'react-router-dom'
import { BiImageAdd } from 'react-icons/bi'
import { Modal, Button } from 'react-bootstrap'
import Axios from 'axios'

function Signup(props) {
	const [email, setEmail] = useState('')
	const [fullName, setFullName] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const [picture, setPicture] = useState('')
	const [imgUrl, setImgUrl] = useState('')

	const onChangePicture = (file) => {
		if (file) {
			setPicture(file)
			const reader = new FileReader()
			reader.addEventListener('load', () => {
				setImgUrl(reader.result)
			})
			reader.readAsDataURL(file)
		}
	}

	const [show, setShow] = useState(false)
	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	const handleSignup = async (e) => {
		e.preventDefault()
		const data = new FormData()
		data.append('file', picture)
		data.append('upload_preset', 'insta-clone')
		data.append('cloud_name', 'utsav007')
		if (picture) {
			try {
				const response = await Axios.post(
					'https://api.cloudinary.com/v1_1/utsav007/image/upload',
					data
				)
				if (response.data.url) {
					try {
						const signupResponse = await Axios.post(
							`${process.env.REACT_APP_URL}/register`,
							{
								email: email,
								fullName: fullName,
								username: username,
								password: password,
								profileImage: response.data.url,
							}
						)
						if (signupResponse.data.success) {
							setSuccess('Signed up successfully!')
							setTimeout(() => {
								props.history.push('/login')
							}, 1500)
						}
					} catch (err) {
						if (err.response.data.error) {
							setError(err.response.data.error)
						}
					}
				}
			} catch (err) {
				console.log(err.response)
			}
		} else {
			try {
				const signupResponse = await Axios.post(
					`${process.env.REACT_APP_URL}/register`,
					{
						email: email,
						fullName: fullName,
						username: username,
						password: password,
					}
				)
				if (signupResponse.data.success) {
					setSuccess('Signed up successfully!')
					setTimeout(() => {
						props.history.push('/login')
					}, 1500)
				}
			} catch (err) {
				if (err.response.data.error) {
					setError(err.response.data.error)
				}
			}
		}
	}

	return (
		<div className="signup-container">
			<form className="signup-form" onSubmit={handleSignup}>
				<div className="logo-word">
					<img src={instaWord} alt="" />
					<h5>Sign up to see photos and videos from your friends.</h5>
				</div>
				<input
					type="text"
					placeholder="Email"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value)
						setError('')
					}}
				/>
				<input
					type="text"
					placeholder="Full Name"
					value={fullName}
					onChange={(e) => {
						setFullName(e.target.value)
						setError('')
					}}
				/>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => {
						setUsername(e.target.value)
						setError('')
					}}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value)
						setError('')
					}}
				/>
				<p style={{ textAlign: 'center' }}>Choose a profile picture.</p>
				<div className="upload-dp">
					<label htmlFor="file-input">
						<BiImageAdd className="choose-img" />
					</label>
					<input
						style={{ display: 'none' }}
						id="file-input"
						type="file"
						onChange={(e) => {
							onChangePicture(e.target.files[0])
							handleShow()
						}}
					/>
				</div>
				<button type="submit" onClick={handleSignup}>
					Sign Up
				</button>
				{error && error ? (
					<p
						className="error-msg"
						style={{ textAlign: 'center', color: 'red' }}
					>
						{error}
					</p>
				) : (
					<p
						className="success-msg"
						style={{ textAlign: 'center', color: 'green' }}
					>
						{success}
					</p>
				)}
			</form>
			<div className="exist-account">
				<h5>
					Have an account?{' '}
					<span>
						<Link to="/login">Login</Link>
					</span>
				</h5>
			</div>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Preview</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<img style={{ width: '100%' }} src={imgUrl} alt="" />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleClose}>
						Okay
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default Signup
