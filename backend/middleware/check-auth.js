const jwt = require('jsonwebtoken');

// this is basically to validate the token, whether user is allowed to access the particular resource/url
module.exports = (req, res, next) =>{
	try{
		const  token = req.headers.authorization.split(" ")[1];  // splitting for reason is that token in set something like this Bearer token_string

		const decodedToken = jwt.verify(token, 'secret_should_long_enough');
		console.log("decoded" + decodedToken);
		// we needed our fetch token in our post while creating the token because we want to access out user id and user email 
		// we will add to our request object
		req.userData = { email: decodedToken.email, user_id: decodedToken.userId};
		next();
	}catch(err){
		res.status(401).json({
			message: "Authentication failed",
			error: err
		});
	}

}