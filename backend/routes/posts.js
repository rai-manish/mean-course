const express = require('express');
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const postController = require('../controllers/post.js')


// to create the post
router.post('',checkAuth, postController.createPost); 

// get all posts 
router.get('', postController.getPosts);

// to delete post
router.delete('/:id', checkAuth, postController.deletePost);

//to update post
router.put('/:id',  checkAuth, postController.updatePost);


//to get particular post
router.get('/:id', postController.showPost);

module.exports = router;