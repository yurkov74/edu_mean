const express = require("express");
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");
const postsController = require("../controllers/posts-routes-controller");

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
  postsController.createPost
);

router.put(
  "/:id",
  checkAuth,
  multer({storage: storage}).single('image'),
  postsController.updatePost
);

router.get("", postsController.getPosts);

router.get("/:id", postsController.getPost);

router.delete(
  "/:id",
  checkAuth,
  postsController.deletePost
);

module.exports = router;
