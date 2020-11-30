import React, { useState } from 'react'
import { Navbar, Nav, Modal, Button, Form, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { BsSearch } from 'react-icons/bs'
import instaLogo from '../../logos/insta-logo.png'
import './nav.css'
import Axios from 'axios'

const handleLogout = () => {
	localStorage.clear()
	window.location.reload()
}

const activeUser = JSON.parse(localStorage.getItem('payload'))

function Navigationbar() {
	const [show, setShow] = useState(false)
	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	const [search, setSearch] = useState('')
	const [searchedUser, setSearchedUser] = useState([])

	const searchUser = async (searchUser) => {
		setSearch(searchUser)
		try {
			const response = await Axios.post(
				`${process.env.REACT_APP_URL}/search`,
				{
					searchUser: searchUser,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
					},
				}
			)
			if (response.data) {
				setSearchedUser(response.data)
			}
		} catch (err) {
			console.log(err.response)
		}
	}

	return (
		<div className="nav-container">
			<Navbar bg="light" variant="light">
				<Navbar.Brand>
					<Link to="/">
						<img src={instaLogo} alt="" />
					</Link>
				</Navbar.Brand>
				<Nav className="ml-auto">
					{localStorage.getItem('accessToken') ? (
						<>
							<BsSearch
								className="search-icon"
								style={{ fontSize: '1.5rem', marginRight: '1rem' }}
								key="1"
								onClick={handleShow}
							/>

							<Link
								key="2"
								style={{
									color: 'black',
									marginRight: '1rem',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
								to="/explore"
							>
								People I follow
							</Link>
							<Link
								key="3"
								style={{
									color: 'black',
									marginRight: '1rem',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
								to="/profile"
							>
								Profile
							</Link>
							<button key="4" onClick={handleLogout} className="logout-btn">
								Log Out
							</button>
						</>
					) : (
						<h4 style={{ padding: '0.5rem' }}>Welcome to Instagram</h4>
					)}
				</Nav>
			</Navbar>
			<>
				<Modal show={show} onHide={handleClose}>
					<Modal.Body
						style={{
							height: '50vh',
							overflowY: 'auto',
						}}
						className="modal-body"
						closeButton
					>
						<Form.Control
							type="email"
							placeholder="Username..."
							value={search}
							onChange={(e) => searchUser(e.target.value)}
						/>
						<ListGroup className="mt-3">
							{searchedUser.map((user) => (
								<ListGroup.Item key={user._id}>
									<Link
										onClick={handleClose}
										className="search-user"
										to={
											user._id === activeUser._id
												? '/profile'
												: `/profile/${user._id}`
										}
									>
										{user.username}
									</Link>
								</ListGroup.Item>
							))}
						</ListGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="danger"
							onClick={() => {
								setSearchedUser([])
								handleClose()
							}}
						>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		</div>
	)
}

export default Navigationbar
