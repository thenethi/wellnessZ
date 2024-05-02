require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cloudinary = require('cloudinary').v2;

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize Sequelize for database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

// Define the Post model
const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tag: {
    type: DataTypes.STRING,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
});

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Route to create a new post
app.post('/posts', async (req, res) => {
  try {
    // Check if image data is provided
    if (!req.body.image) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: 'wellnessZ', // Optional: Specify a folder in Cloudinary to store images
    });

    // Create post with imageUrl
    const post = await Post.create({
      title: req.body.title,
      desc: req.body.desc,
      tag: req.body.tag,
      imageUrl: result.secure_url,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to get all posts with options
app.get('/posts', async (req, res) => {
    try {
      // Pagination options
      const page = parseInt(req.query.page) || 1; // Current page number
      const pageSize = parseInt(req.query.pageSize) || 10; // Number of posts per page
  
      // Sorting options
      const sortBy = req.query.sortBy || 'createdAt'; // Field to sort by
      const sortOrder = req.query.sortOrder || 'desc'; // Sorting order (asc or desc)
  
      // Keyword filtering option
      const keyword = req.query.keyword || ''; // Keyword to filter posts by title or description
  
      // Tag filtering option
      const tag = req.query.tag || ''; // Tag to filter posts by
  
      // Database query options based on the provided options
      const queryOptions = {
        order: [[sortBy, sortOrder]],
        offset: (page - 1) * pageSize,
        limit: pageSize,
        where: {},
      };
  
      // Apply keyword filtering
      if (keyword) {
        queryOptions.where[Sequelize.Op.or] = [
          { title: { [Sequelize.Op.iLike]: `%${keyword}%` } }, // Case-insensitive search for title
          { desc: { [Sequelize.Op.iLike]: `%${keyword}%` } }, // Case-insensitive search for description
        ];
      }
  
      // Apply tag filtering
      if (tag) {
        queryOptions.where.tag = tag;
      }
  
      // Fetch posts from the database based on the query options
      const posts = await Post.findAll(queryOptions);
  
      // Respond with the fetched posts
      res.status(200).json(posts);
    } catch (error) {
      // Handle errors
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// Start the server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
