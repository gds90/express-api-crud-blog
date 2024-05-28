const express = require("express");
const router = express.Router();

// Post controller
const postsController = require("../controllers/posts.js");

// Rotte
router.get('/', postsController.index);

router.get('/create', postsController.create);

router.get('/:slug', postsController.show);

router.get('/:slug/download', postsController.download);

module.exports = router;