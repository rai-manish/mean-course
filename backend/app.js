const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// it is just to create a express app
// express provided lots of functionalioty to behave lika middleware b/w req and resp
const app = express();

const postsRoutes = require('./routes/posts')
const usersRoutes = require('./routes/users');;

			// use k/w is used to create a middleware
				// app.use((req, res, next) => {
				// 	console.log('first middleware');
				// 	//it will pass a request to next middleware
				// 	next();
				// });

				// app.use((req, res, next) => {
				// 	// response object is more powerful than node js response object
				// 	//send method is used to send back the rssponse back to the browser, but it automatically do the othe rimportnat tasks like setting up the header etc.
				// 	console.log("second middleware");
				// 	res.send('calling from middleware');
				// });

// body-parser is a npm module which allow to parse the body of the request
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false}));

mongoose.connect('mongodb://localhost/mean-course').then(() => {
	console.log('connected to databse successfully');
}).catch(() => {
	console.log('connected to databse failed');
});
// cross origin
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Authorization, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods',"GET, POST, PATCH,PUT, DELETE, OPTIONS");
	next();
});

// just to aware express about the post routes
app.use("/api/posts",postsRoutes);
app.use("/api/users",usersRoutes);
//to export the express js app
module.exports = app;






