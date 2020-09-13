const express = require("express");

const checkAuth = require("../middleware/check-auth");
const storeImg = require("../middleware/store-img");
const postsController = require("../controllers/posts-routes-controller");

const router = express.Router();

router.post(
  "",
  checkAuth,
  storeImg,
  postsController.createPost
);

router.put(
  "/:id",
  checkAuth,
  storeImg,
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
