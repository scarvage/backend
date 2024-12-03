const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { verifyToken } = require('../utils/jwtUtils'); 
// Blog CRUD routes
router.post('/create', blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:blogId', blogController.getBlogById);
router.put('/:blogId', blogController.updateBlog);
router.delete('/:blogId', blogController.deleteBlog);

module.exports = router;
