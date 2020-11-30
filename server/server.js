const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const userRoute = require('./routes/user')
const cors = require('cors')
const PORT = process.env.PORT || 8080
const path = require('path')
require('dotenv/config')

//middlware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

//database connect
mongoose.connect(
	process.env.DB_CONNECT,
	{
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	},
	(err) => {
		if (err) {
			console.log('Connection to database failed!')
		}
		console.log('Connected to database successfully!')
	}
)

//route middleware
app.use('/v1/api', authRoute)
app.use('/v1/api', postRoute)
app.use('/v1/api', userRoute)


//run server
app.listen(PORT, () => {
	console.log(`Server up and running at port ${PORT}`)
})
