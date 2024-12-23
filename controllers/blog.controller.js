const Blog = require('../models/blog.model');

// Create a new blog
exports.createBlog = async (req, res) => {
  const { title, content, author, premium } = req.body;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : null; // Generate image URL

  try {
    const newBlog = new Blog({
      title,
      content,
      author,
      premium,
      coverImage,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog); // Return blog with image URL
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  const { blogId } = req.params;
  const { title, content, author, premium } = req.body;
  const coverImage = req.file ? req.file.buffer : null;

  try {
    const updateFields = {
      title,
      content,
      author,
      premium: premium || false,
      updatedAt: Date.now(),
    };

    if (coverImage) updateFields.coverImage = coverImage;

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateFields, { new: true });

    if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  const { blogId } = req.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
