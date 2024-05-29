const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploader = multer({ dest: "public/imgs/posts" });
const postSlugExists = require("../middlewares/postSlugExists.js");

// Post controller
const postsController = require("../controllers/posts.js");

router.use(express.urlencoded({ extended: true }));

// Rotte
router.get('/', postsController.index);

router.post('/create', uploader.single("image"), postsController.create);

router.get('/:slug', postsController.show);

router.get('/:slug/download', postsController.download);

router.delete('/:slug', postSlugExists, postsController.destroy);

module.exports = router;