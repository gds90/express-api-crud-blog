const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploader = multer({ dest: "public/imgs/posts" });

// Post controller
const postsController = require("../controllers/posts.js");

// Rotte
router.get('/', postsController.index);

router.post('/create', uploader.single("image"), postsController.create);

router.get('/:slug', postsController.show);

router.get('/:slug/download', postsController.download);

router.delete('/:slug', postsController.destroy);

module.exports = router;