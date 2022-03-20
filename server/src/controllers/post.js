const Post = require('../models/post');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Joi = require('joi');

const checkObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).end();
    return;
  }
  return next();
};

const write = async (req, res) => {
  const { title, body, tags, images } = req.body;
  const post = new Post({
    title,
    body,
    images,
    tags,
  });
  try {
    await post.save();
    res.status(200).send(post);
  } catch (e) {
    res.status(500).send(e);
  }
};

const list = async (req, res) => {
  try {
    const posts = await Post.find().exec();
    res.status(200).send(posts);
  } catch (e) {
    res.status(500).send(e);
  }
};

const read = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).exec();
    //왜이거 404가안뜨지....end()를 붙여줘야함
    if (!post) {
      res.status(404).end();
      return;
    }
    res.status(200).send(post);
  } catch (e) {
    res.status(500).send(e);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    res.status(204).end(); // No Content(success but no need to send res)
  } catch (e) {
    res.status(500).send(e);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true, //return updated data
      // false: return before update data
    }).exec();
    if (!post) {
      res.status(404).end();
      return;
    }
    res.send(post);
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = { checkObjectId, write, list, read, remove, update };
