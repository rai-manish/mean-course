const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//login the user
exports.userLogin = (req, res, next) =>{
	let fetchedUser ;
	User.findOne({ email: req.body.email}).then(user =>{
		if(!user){
			return res.status(401).json({
				message: "Authentication failed"
			});
		}
		fetchedUser = user;
		return bcrypt.compare(req.body.password, user.password);
	}).then(result =>{
		if(!result){
			return res.status(401).json({
				message: "Authentication failed"
			});
		}
		// generate json web token
		const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, 'secret_should_long_enough',{expiresIn: '1h'})

		res.json({
			message: "Authentication successfull",
			token: token,
			expiresIn: 3600, 
			userId: fetchedUser._id
		})
	}).catch(err =>{
		return res.status(401).json({
			message: "Authentication failed"
		});
	})
}


// create the user
exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hashedPassword => {
    const user = new User({
      email: req.body.email,
      password: hashedPassword
    });
    user.save()
      .then(createdUser => {
        res.status(201).json({
          message: "User Created Successfully",
          user: createdUser
        });
      }).catch(err => {
        res.status(500).json({
          message: "An Authentication failed"
        });
      });
  });
}