const router = require("express").Router();
const handleAuth = require('../../controllers/intern1/handleAuth');
const handlePosts = require('../../controllers/intern1/handlePosts');

router.use('/auth',handleAuth);
router.use('/posts',handlePosts);

module.exports = router;