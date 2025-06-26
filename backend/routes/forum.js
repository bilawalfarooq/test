const express = require('express');
const ForumPost = require('../models/ForumPost');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all posts for a course
router.get('/course/:courseId', auth, async (req, res) => {
  const posts = await ForumPost.find({ course: req.params.courseId }).populate('author', 'name role');
  res.json(posts);
});

// Create a post
router.post('/', auth, async (req, res) => {
  const { course, title, content } = req.body;
  if (!course || !title || !content) return res.status(400).json({ message: 'Missing fields' });
  const post = new ForumPost({ course, author: req.user.userId, title, content });
  await post.save();
  res.status(201).json({ message: 'Post created', post });
});

// Reply to a post
router.post('/:id/reply', auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content required' });
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  post.replies.push({ author: req.user.userId, content });
  await post.save();
  res.json({ message: 'Reply added', post });
});

module.exports = router;
