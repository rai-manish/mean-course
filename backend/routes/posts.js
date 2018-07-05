const express = require('express');
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();


// to create the post

router.post('',checkAuth, (req, res, next) => {
	// body is a new field added by a body parser to req object

	const post = new Post({
		title: req.body.title,
		content: req.body.content,
		creator: req.userData.user_id
	});

	// console.log("posts" + post);

	// collection name will be plural of your model. i.e models
	post.save().then((createdPost) => {
		res.status(201).json({
			message: "Post Added successfully", 
			id: createdPost._id
		});
	}).catch((error) => {
		console.log("error occured while saving the record");
		console.log(error);
	});
	console.log(post);
}); 

// get all posts 

router.get('',(req, res, next) => {

	// setting the page size and no of page
	const pageSize = +req.query.pageSize; // +sign is to convert string query parameter to numeric
	const currentPage = +req.query.page;
	const postQuery = Post.find();
	let fetchedDocuments;
	if (pageSize && currentPage){
		postQuery
			.skip(pageSize * (currentPage - 1))
			.limit(pageSize);
	}
	// fetching the data form mongodb
	postQuery.then((documents) => {
		// storing into the fetched documents because we wont be able to get into next promis  which is to get all the posts count
		fetchedDocuments = documents;
		return Post.count();
	}).then((count) => {
		res.status(200).json({
			message: "post fetch successfully",
			posts: fetchedDocuments,
			maxPost: count
		});
	}).catch((error) => {
		console.log('error occured while fetching the data');
		console.log(error);
	});

});

// to delete post
router.delete('/:id', checkAuth,(req, res, next) => {
	Post.deleteOne({ _id: req.params.id, creator: req.userData.user_id}).then((result) => {
		console.log('record deleted');
		if(result.n > 0){
			res.status(200).json({
				message: "post deleted sucessfully",
			});
		}
		else{
			res.status(401).json({
				message: "Not Authorised"
			});
		}
	}).catch((error) => {
			console.log("error occured while deleting the record");
			console.log(error);
	});
});

//to update post

router.put('/:id',  checkAuth, (req, res, next) => {
	const post = new Post({
		_id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		creator: req.userData.user_id
	});
	// adding condition to check only associated user with post should be able to eupdate the post
	Post.updateOne({ _id: req.params.id, creator: req.userData.user_id}, post).then((result) => {
		console.log(result);
		if(result.n > 0)
			res.status(200).json({
				message: "Post updated successfully"
			});
		else{
			res.status(401).json({
				message: "Not Authorised"
			});
		}
	}).catch((error) => {
		console.log("error occured while updating the record");
		console.log(error);
	})
});

//to get particular post

router.get('/:id', (req, res, next) => {
	Post.findById(req.params.id).then((post) => {
		if(post){
			res.status(200).json(post);
		}else{
			res.status(400).json({message: "Post Not Found"});
		}
	}).catch((error) => {
		console.log('error occured while fetching the data');
		console.log(error);
	});
});

module.exports = router;