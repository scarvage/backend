const express = require('express');
const multer = require('multer');
const router = express.Router();
const { verifyToken } = require('../utils/jwtUtils'); 

const blogController = require('../controllers/blog.controller');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage });
  

// Blog CRUD routes
router.post('/create', upload.single('coverImage'), blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:blogId', blogController.getBlogById);
router.put('/:blogId',upload.single('coverImage'), blogController.updateBlog);
router.delete('/:blogId', blogController.deleteBlog);

module.exports = router;
