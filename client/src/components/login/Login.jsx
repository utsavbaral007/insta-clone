import React, { useState, useEffect } from 'react'
import './login.css'
import instaWord from '../../logos/insta-logo.png'
import { Link } from 'react-router-dom'
import Axios from 'axios'

function Login(props) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const handleLogin = async (e) => {
		e.preventDefault()
		try {
			const response = await Axios.post(`${process.env.REACT_APP_URL}/login`, {
				username: username,
				password: password,
			})
			if (response.data.success) {
				localStorage.setItem('accessToken', response.data.accessToken)
				localStorage.setItem('payload', JSON.stringify(response.data.user))
				setSuccess('Logged in successfully!')
				setTimeout(() => {
					window.location.reload()
					props.history.push('/')
				}, 1000)
			}
		} catch (error) {
			if (error.response.data.error) {
				setError(error.response.data.error)
			}
		}
	}

	useEffect(() => {
		if (localStorage.getItem('accessToken')) {
			props.history.push('/')
		}
	}, [props.history])
	return (
		<div className="login-container">
			<form className="login-form" onSubmit={handleLogin}>
				<div className="insta-logo">
					<img src={instaWord} alt="" />
				</div>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit" onClick={handleLogin}>
					Login
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
			<div className="new-user">
				<h5>
					Don't have an account?{' '}
					<span>
						<Link to="/signup">Sign Up</Link>
					</span>
				</h5>
			</div>
		</div>
	)
}

export default Login
