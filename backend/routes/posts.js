const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid image mime type');
    if (isValid) error = null;

    callback(error, "backend/images");
  },
  filename: (request, file, callback) => {
    const fname = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];

    callback(null, fname + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({storage: storage}).single('image'),
  (req, res, next) => {
    const srvUrl = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: srvUrl + '/images/' + req.file.filename,
      creator: req.userData.userId
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          // ...createdPost,
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
        }
      });
    })
    .catch(error => res.status(500).json({
      message: "Error saving new post!",
      error: error
    }));
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({storage: storage}).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const srvUrl = req.protocol + '://' + req.get('host');
      imagePath = srvUrl + '/images/' + req.file.filename;
    };
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
      if(result.nModified > 0) {
        res.status(200).json({ message: "Post updated successfully!" });
      } else { res.status(401).json({ message: "Post update failed: you're not authorized to edit this post!" }); };
    })
    .catch(error => res.status(500).json({
      message: "Post update failed!",
      error: error
    }));
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let postQuery = Post.find();
  let fetchedPosts = [];
  if (pageSize && currentPage) {
    postQuery = postQuery.skip((currentPage-1)*pageSize).limit(pageSize);
  };
  postQuery
  .then(documents => {
    this.fetchedPosts = documents; //console.log('Posts recieved from db: ', this.fetchedPosts.length);
    return Post.estimatedDocumentCount();
  })
  .then(count => {
    console.log('Posts recieved from db: ', this.fetchedPosts.length);
    console.log('Total posts in db: ', count);
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: this.fetchedPosts,
      maxPosts: count
    });
  })
  .catch(error => res.status(500).json({
    message: "Error getting posts list from server!",
    error: error
  }));
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  })
  .catch(error => res.status(500).json({
    message: "Error getting the post from server!",
    error: error
  }));
});

router.delete(
  "/:id",
  checkAuth,
  (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
      // console.log('Delete result', result);
      if(result.deletedCount > 0) {
        res.status(200).json({ message: "Post deleted!" });
      } else { res.status(401).json({ message: "You're not authorized to delete this post!" }); };
    })
    .catch(error => res.status(500).json({
      message: "Error deleting the post!",
      error: error
    }));
  }
);

module.exports = router;
