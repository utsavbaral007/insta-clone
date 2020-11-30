import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Signup from './components/signup/Signup'
import Login from './components/login/Login'
import Navigationbar from './components/Navigationbar/Navigationbar'
import Profile from './components/profile/Profile'
import Homepage from './components/Homepage/Homepage'
import Newpost from './components/newpost/Newpost'
import Privateroute from './components/Privateroute'
import Userprofile from './components/Userprofile/Userprofile'
import Explore from './components/Explore/Explore'
function App() {
	return (
		<Router>
			<Navigationbar />
			<div>
				<Switch>
					<Privateroute path="/" exact component={Homepage} />
					<Privateroute path="/profile" exact component={Profile} />
					<Privateroute path="/profile/:userId" exact component={Userprofile} />
					<Route path="/signup" exact component={Signup} />
					<Route path="/login" exact component={Login} />
					<Privateroute path="/newpost" exact component={Newpost} />
					<Privateroute path="/explore" exact component={Explore} />
				</Switch>
			</div>
		</Router>
	)
}

export default App
